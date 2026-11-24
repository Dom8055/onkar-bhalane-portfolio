from __future__ import annotations

import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from app.core.config import get_settings

logger = logging.getLogger("portfolio.email")


async def send_email(to_email: str, subject: str, html_body: str, text_body: str = "") -> bool:
    """Send an email via SMTP when configured; log cleanly in development mode."""
    settings = get_settings()
    if not settings.SMTP_HOST or not settings.SMTP_USER:
        logger.info("[EMAIL DEV LOG] To=%s | Subject=%s\n%s", to_email, subject, text_body or html_body)
        return True

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = settings.SMTP_FROM_EMAIL
        msg["To"] = to_email
        if text_body:
            msg.attach(MIMEText(text_body, "plain"))
        msg.attach(MIMEText(html_body, "html"))

        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10) as server:
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(settings.SMTP_FROM_EMAIL, [to_email], msg.as_string())
        return True
    except Exception as exc:
        logger.warning("Email delivery failed: %s", exc)
        return False


async def notify_new_contact_inquiry(name: str, email: str, subject: str, message: str) -> bool:
    settings = get_settings()
    html = f"""
    <div style="font-family: Inter, sans-serif; background:#080B12; color:#F5F5F5; padding:24px; border-radius:12px;">
      <h2 style="color:#D8B779; margin-top:0;">New Portfolio Inquiry</h2>
      <p><strong>From:</strong> {name} ({email})</p>
      <p><strong>Subject:</strong> {subject}</p>
      <div style="background:#151C2B; padding:16px; border-radius:8px; border-left:3px solid #B68B50; white-space:pre-wrap;">{message}</div>
    </div>
    """
    return await send_email(
        to_email=settings.CONTACT_NOTIFY_EMAIL,
        subject=f"[Portfolio Inquiry] {subject}",
        html_body=html,
        text_body=f"From: {name} <{email}>\nSubject: {subject}\n\n{message}",
    )


async def send_password_reset_email(email: str, reset_token: str) -> bool:
    settings = get_settings()
    reset_url = f"{settings.FRONTEND_URL}/admin/login?reset_token={reset_token}"
    html = f"""
    <div style="font-family: Inter, sans-serif; background:#080B12; color:#F5F5F5; padding:24px; border-radius:12px;">
      <h2 style="color:#D8B779; margin-top:0;">Admin Password Reset</h2>
      <p>A password reset was requested for your Onkar Bhalane Portfolio Admin account.</p>
      <p><a href="{reset_url}" style="color:#D8B779;">Reset Password</a></p>
      <p>Or copy token: <code>{reset_token}</code></p>
      <p style="color:#A3AAB8; font-size:12px;">This token expires in 30 minutes.</p>
    </div>
    """
    return await send_email(
        to_email=email,
        subject="Onkar Bhalane Portfolio — Admin Password Reset",
        html_body=html,
        text_body=f"Reset link: {reset_url}\nToken: {reset_token}",
    )
