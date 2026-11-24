from __future__ import annotations

import asyncio
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from app.api.admin import router as admin_router
from app.api.auth import router as auth_router
from app.api.portfolio import router as portfolio_router
from app.core.config import get_settings
from app.database.indexes import ensure_indexes
from app.database.mongodb import db_manager, get_database
from app.database.seed import seed_database

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)
logger = logging.getLogger("portfolio.app")

_initialized = False


async def ensure_initialized() -> None:
    global _initialized
    if _initialized and db_manager.db is not None:
        return
    await db_manager.connect()
    db = get_database()
    await ensure_indexes(db)
    await seed_database(db)
    _initialized = True
    logger.info("Portfolio API ready (mock_db=%s)", db_manager.using_mock)


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        await ensure_initialized()
    except Exception as exc:
        logger.error("Startup DB initialization failed: %s", exc)
    yield
    await db_manager.disconnect()


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title=settings.APP_NAME,
        description="RESTful API & Admin CMS backend for Onkar Bhalane — Flutter Developer Portfolio",
        version="1.0.0",
        docs_url="/api/docs",
        redoc_url="/api/redoc",
        openapi_url="/api/openapi.json",
        lifespan=lifespan,
    )

    @app.middleware("http")
    async def ensure_db_middleware(request: Request, call_next):
        if request.url.path == "/api/health":
            return await call_next(request)
        try:
            await ensure_initialized()
        except Exception as exc:
            logger.exception("Database initialization error")
            return JSONResponse(
                status_code=503,
                content={
                    "detail": "Database connection unavailable",
                    "error": f"{type(exc).__name__}: {exc}",
                },
            )
        return await call_next(request)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(auth_router, prefix=settings.API_PREFIX)
    app.include_router(portfolio_router, prefix=settings.API_PREFIX)
    app.include_router(admin_router, prefix=settings.API_PREFIX)

    # Serve uploaded images and documents
    try:
        app.mount("/uploads", StaticFiles(directory=str(settings.upload_path)), name="uploads")
    except Exception as exc:
        logger.warning("Skipping /uploads static mount: %s", exc)

    @app.get("/api/health", tags=["Health"])
    async def health_check():
        try:
            await ensure_initialized()
            return {
                "status": "healthy",
                "database": "mongomock" if db_manager.using_mock else "mongodb",
                "environment": settings.ENVIRONMENT,
            }
        except Exception as exc:
            return JSONResponse(
                status_code=503,
                content={
                    "status": "unhealthy",
                    "database": "disconnected",
                    "error": f"{type(exc).__name__}: {exc}",
                    "environment": settings.ENVIRONMENT,
                },
            )

    return app


app = create_app()
