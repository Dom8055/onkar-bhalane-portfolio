from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from app.core.config import get_settings
from app.core.security import hash_password


def now_utc() -> datetime:
    return datetime.now(timezone.utc)


async def seed_database(db: Any) -> None:
    """
    Idempotently seed all collections with 100% verified data extracted from
    Onkar Bhalane's Resume PDF and Portfolio 2026 PDF.
    """
    settings = get_settings()
    ts = now_utc()

    # 1. Admin Account
    if await db.admins.count_documents({}) == 0:
        await db.admins.insert_one(
            {
                "name": settings.ADMIN_NAME,
                "email": settings.ADMIN_EMAIL.lower(),
                "password_hash": hash_password(settings.ADMIN_PASSWORD),
                "role": "super_admin",
                "is_active": True,
                "created_at": ts,
                "updated_at": ts,
                "last_login_at": None,
            }
        )

    # 2. Profile
    if await db.profiles.count_documents({}) == 0:
        await db.profiles.insert_one(
            {
                "name": "Onkar Bhalane",
                "title": "Flutter Developer | Mobile Application Engineer",
                "subtitle": "Cross-platform mobile apps for Android & iOS — healthcare, fintech, e-commerce, logistics, and education.",
                "tagline": "Building digital experiences that connect people, technology, and innovation.",
                "summary": (
                    "Flutter Developer with 4+ years of experience building and shipping production-grade "
                    "cross-platform mobile applications for Android and iOS across healthcare, fintech, "
                    "e-commerce, logistics, and education domains."
                ),
                "about_paragraphs": [
                    (
                        "Flutter Developer with 4+ years of experience building and shipping production-grade "
                        "cross-platform mobile applications for Android and iOS across healthcare, fintech, "
                        "e-commerce, logistics, and education. Skilled in end-to-end mobile development using "
                        "GetX state management, REST API integration, and Firebase services (Authentication, "
                        "Firestore, Cloud Messaging, real-time chat)."
                    ),
                    (
                        "Proven track record integrating third-party SDKs (Razorpay, Agora, Google Maps) and "
                        "coordinating with backend teams across PHP, Java Spring Boot, .NET, Laravel, and Python "
                        "stacks. Experienced in performance optimization, responsive UI development, Android "
                        "device compatibility (ProGuard/R8), and full Play Store / App Store deployment cycles. "
                        "Strong client-facing communicator with a history of owning projects from requirement "
                        "gathering through release."
                    ),
                ],
                "core_competencies": [
                    "Cross-Platform Mobile Development (Android & iOS)",
                    "REST API Integration",
                    "Firebase Services",
                    "Third-Party SDK Integration (Razorpay, Agora, Google Maps)",
                    "GetX State Management",
                    "Responsive UI Development",
                    "Performance Optimization & Android Compatibility",
                    "Client Requirement Gathering & Communication",
                    "End-to-End Project Ownership",
                    "Google Play Store & App Store Deployment",
                ],
                "stats": [
                    {"value": "4+", "label": "Years of Experience"},
                    {"value": "10+", "label": "Production Flutter Apps"},
                    {"value": "5", "label": "Industry Domains"},
                    {"value": "5", "label": "Backend Stacks Integrated"},
                ],
                "profile_image": "/assets/portraits/portrait_corporate_black_suit_gold_tie.webp",
                "about_image": "/assets/portraits/portrait_cinematic_black_turtleneck.webp",
                "secondary_portrait": "/assets/portraits/portrait_editorial_seated_black_suit.webp",
                "contact_image": "/assets/portraits/portrait_editorial_thoughtful_black_blazer.webp",
                "hero_background_image": "/assets/backgrounds/hero_portrait_wide_composition.webp",
                "resume_url": "/api/portfolio/resume",
                "location": "Nagpur, Maharashtra, India",
                "email": "obhalane@gmail.com",
                "phone": "+91 72496 03542",
                "availability_status": "Open to Flutter & Mobile Engineering Opportunities",
                "is_available": True,
                "social_links": {
                    "linkedin": "https://linkedin.com/in/onkar-bhalane-b53823180",
                    "github": "",
                    "portfolio": "https://sites.google.com/view/onkar-bhalane/home",
                    "twitter": "",
                    "website": "",
                },
                "created_at": ts,
                "updated_at": ts,
            }
        )

    # 3. Technical Skills (10 Categories — no fabricated proficiency percentages)
    if await db.skills.count_documents({}) == 0:
        skills_seed = [
            # 1. Programming Languages
            ("Dart", "Programming Languages", "code", 1),
            ("PHP", "Programming Languages", "code", 2),
            ("JavaScript", "Programming Languages", "code", 3),
            # 2. Mobile Application Development
            ("Flutter (Android & iOS)", "Mobile Application Development", "smartphone", 1),
            ("Cross-Platform Development", "Mobile Application Development", "layers", 2),
            ("Responsive UI", "Mobile Application Development", "layout", 3),
            ("MVC / MVVM Architecture", "Mobile Application Development", "cpu", 4),
            # 3. State Management
            ("GetX", "State Management", "zap", 1),
            ("Provider", "State Management", "box", 2),
            ("Riverpod", "State Management", "git-branch", 3),
            ("BLoC", "State Management", "workflow", 4),
            # 4. Backend & API Integration
            ("REST API Integration", "Backend & API Integration", "globe", 1),
            ("JSON", "Backend & API Integration", "braces", 2),
            ("Java Spring Boot", "Backend & API Integration", "server", 3),
            ("Laravel", "Backend & API Integration", "server", 4),
            (".NET", "Backend & API Integration", "server", 5),
            ("Python", "Backend & API Integration", "terminal", 6),
            ("PHP (MVC)", "Backend & API Integration", "database", 7),
            # 5. Firebase Services
            ("Firebase Authentication", "Firebase Services", "shield", 1),
            ("Cloud Firestore", "Firebase Services", "database", 2),
            ("Firebase Cloud Messaging", "Firebase Services", "bell", 3),
            ("Real-Time Chat", "Firebase Services", "message-square", 4),
            # 6. Third-Party SDKs
            ("Razorpay Payment Gateway", "Third-Party SDKs", "credit-card", 1),
            ("Agora SDK", "Third-Party SDKs", "video", 2),
            ("Google Maps", "Third-Party SDKs", "map-pin", 3),
            ("SharedPreferences", "Third-Party SDKs", "hard-drive", 4),
            # 7. Authentication & Verification
            ("Aadhaar & PAN Verification", "Authentication & Verification", "fingerprint", 1),
            ("CIBIL Score Integration", "Authentication & Verification", "shield-check", 2),
            ("Secure User Authentication", "Authentication & Verification", "lock", 3),
            # 8. Web Technologies
            ("HTML", "Web Technologies", "file-code", 1),
            ("CSS", "Web Technologies", "palette", 2),
            ("Bootstrap", "Web Technologies", "grid", 3),
            ("Framework7", "Web Technologies", "smartphone", 4),
            ("jQuery", "Web Technologies", "code", 5),
            ("Ajax", "Web Technologies", "refresh-cw", 6),
            # 9. Tools & Deployment
            ("Android Studio", "Tools & Deployment", "wrench", 1),
            ("Xcode", "Tools & Deployment", "wrench", 2),
            ("VS Code", "Tools & Deployment", "terminal", 3),
            ("Git", "Tools & Deployment", "git-branch", 4),
            ("GitHub", "Tools & Deployment", "github", 5),
            ("Google Play Store", "Tools & Deployment", "play", 6),
            ("App Store Connect", "Tools & Deployment", "apple", 7),
            # 10. Performance Optimization
            ("App Performance Tuning", "Performance Optimization", "gauge", 1),
            ("Android 10–16 Compatibility", "Performance Optimization", "smartphone", 2),
            ("ProGuard / R8 Configuration", "Performance Optimization", "shield", 3),
        ]
        await db.skills.insert_many(
            [
                {
                    "name": name,
                    "category": cat,
                    "icon_name": icon,
                    "icon_url": "",
                    "proficiency_label": None,
                    "proficiency_level": None,
                    "is_visible": True,
                    "order": idx,
                    "created_at": ts,
                    "updated_at": ts,
                }
                for name, cat, icon, idx in skills_seed
            ]
        )

    # 4. Professional Experience
    if await db.experiences.count_documents({}) == 0:
        experiences_seed = [
            {
                "company": "Vitric Business Solutions Pvt. Ltd.",
                "role": "Flutter Developer",
                "duration": "Sep 2025 – Present",
                "location": "Nagpur, India",
                "is_current": True,
                "responsibilities": [
                    "Design, develop, and maintain cross-platform Flutter applications using GetX for state management.",
                    "Build responsive, reusable UI components with clean architecture and scalable code structure.",
                    "Integrate REST APIs and manage secure session handling and data persistence.",
                    "Resolve platform-specific issues and maintain compatibility across a wide range of Android versions.",
                    "Collaborate with backend and design teams to deliver features on schedule.",
                ],
                "technologies": ["Flutter", "Dart", "GetX", "REST APIs", "Android", "iOS"],
                "order": 1,
                "is_visible": True,
                "created_at": ts,
                "updated_at": ts,
            },
            {
                "company": "Techquadra Software Solutions",
                "role": "Flutter Developer",
                "duration": "May 2024 – Aug 2025",
                "location": "Nagpur, India",
                "is_current": False,
                "responsibilities": [
                    "Delivered cross-platform Flutter applications end-to-end, from requirement gathering to Play Store/App Store release.",
                    "Integrated third-party SDKs and Firebase services including real-time chat and push notifications.",
                    "Worked with cross-functional backend teams to design and consume REST APIs.",
                    "Optimized app performance and UI responsiveness across varied device configurations.",
                    "Coordinated directly with clients and stakeholders on feature scope and delivery timelines.",
                ],
                "technologies": ["Flutter", "Firebase", "REST APIs", "Razorpay", "Agora SDK", "Play Store", "App Store"],
                "order": 2,
                "is_visible": True,
                "created_at": ts,
                "updated_at": ts,
            },
            {
                "company": "Grin Technologies",
                "role": "Flutter Developer",
                "duration": "Mar 2023 – May 2024",
                "location": "Nagpur, India",
                "is_current": False,
                "responsibilities": [
                    "Developed and maintained cross-platform mobile applications across multiple business domains.",
                    "Designed offline-capable workflows with reliable data synchronization.",
                    "Built real-time data sync features across multiple user roles.",
                    "Partnered with clients to finalize project scope and ensure on-time, high-quality delivery.",
                ],
                "technologies": ["Flutter", "Dart", "Offline Sync", "Python", ".NET", "Laravel"],
                "order": 3,
                "is_visible": True,
                "created_at": ts,
                "updated_at": ts,
            },
            {
                "company": "My Tec Sys",
                "role": "Mobile App Developer",
                "duration": "Jan 2022 – Mar 2023",
                "location": "Nagpur, India",
                "is_current": False,
                "responsibilities": [
                    "Built mobile applications using Flutter, integrating Firebase and location-based services.",
                    "Developed backend-driven features using PHP/MySQL, including secure user registration flows.",
                    "Contributed across the full mobile development lifecycle, from UI implementation to Play Store deployment.",
                    "Built foundational expertise in Flutter and Dart development.",
                ],
                "technologies": ["Flutter", "Dart", "Firebase", "Google Maps", "PHP", "MySQL", "Framework7"],
                "order": 4,
                "is_visible": True,
                "created_at": ts,
                "updated_at": ts,
            },
        ]
        await db.experiences.insert_many(experiences_seed)

    # 5. Featured & Other Projects (All 11 verified projects with real store URLs from Resume PDF)
    if await db.projects.count_documents({}) == 0:
        projects_seed = [
            {
                "title": "Purti Super Bazar",
                "slug": "purti-super-bazar",
                "subtitle": "E-Commerce / Grocery Delivery",
                "category": "E-Commerce",
                "industry_badge": "E-COMMERCE · GROCERY DELIVERY",
                "short_description": "Flutter grocery shopping app for daily essentials and supplements, built for performance and scale.",
                "full_description": (
                    "Purti Super Bazar is a production cross-platform grocery shopping application built with Flutter "
                    "for daily essentials and supplements. Engineered for high performance across large product catalogs, "
                    "the application delivers seamless browsing, real-time order handling, and secure customer sessions "
                    "on both Android and iOS."
                ),
                "contribution": [
                    "Integrated REST APIs for real-time product, order, and user data handling.",
                    "Built responsive, dynamic tab and product-card UI optimized for large product catalogs.",
                    "Implemented secure authentication and scalable state management for high performance.",
                ],
                "technologies": ["Flutter", "Dart", "REST API", "GetX"],
                "cover_image": "/assets/projects/purti-super-bazar/purti_super_bazar_promotional_mockup.webp",
                "gallery_images": [],
                "google_play_url": "https://play.google.com/store/apps/details?id=com.purtibazar.app",
                "app_store_url": "https://apps.apple.com/in/app/purti-super-bazar/id6755988238",
                "github_url": "",
                "live_url": "",
                "extra_links": [],
                "is_featured": True,
                "is_published": True,
                "order": 1,
                "accent_color": "#B68B50",
            },
            {
                "title": "Purti Delivery Partner",
                "slug": "purti-delivery-partner",
                "subtitle": "Rider App · Logistics / Last-Mile Delivery",
                "category": "Logistics",
                "industry_badge": "LOGISTICS · LAST-MILE DELIVERY",
                "short_description": "Dedicated Flutter app for delivery personnel to manage and fulfill customer orders.",
                "full_description": (
                    "Purti Delivery Partner (Rider App) empowers last-mile delivery personnel to accept, manage, "
                    "and fulfill customer grocery orders efficiently. Designed around speed and clarity for field riders "
                    "with real-time status updates and authenticated rider profile management."
                ),
                "contribution": [
                    "Integrated APIs for fetching assigned orders and updating real-time delivery progress.",
                    "Built a fast, minimal UI with authenticated profile management.",
                ],
                "technologies": ["Flutter", "Dart", "REST API", "GetX"],
                "cover_image": "/assets/projects/purti-delivery-partner/02_assigned_orders.jpg",
                "gallery_images": [
                    "/assets/projects/purti-delivery-partner/02_assigned_orders.jpg",
                    "/assets/projects/purti-delivery-partner/03_order_details_navigation.jpg",
                    "/assets/projects/purti-delivery-partner/04_item_verification_payment.jpg",
                    "/assets/projects/purti-delivery-partner/05_delivery_status_timeline.jpg",
                    "/assets/projects/purti-delivery-partner/06_cash_settlement_confirmation.jpg",
                    "/assets/projects/purti-delivery-partner/07_order_completed.jpg",
                    "/assets/projects/purti-delivery-partner/08_past_orders.jpg",
                    "/assets/projects/purti-delivery-partner/01_splash_screen.jpg",
                ],
                "google_play_url": "https://play.google.com/store/apps/details?id=com.app.purtiriderapp",
                "app_store_url": "https://apps.apple.com/app/rider-purti-super-bazar/id6771723062",
                "github_url": "",
                "live_url": "",
                "extra_links": [],
                "is_featured": True,
                "is_published": True,
                "order": 2,
                "accent_color": "#C99A5B",
            },
            {
                "title": "Insta Wash Clean",
                "slug": "insta-wash-clean",
                "subtitle": "Multi-Role Laundry Service Application",
                "category": "E-Commerce",
                "industry_badge": "ON-DEMAND · LAUNDRY SERVICE",
                "short_description": "Dedicated Flutter app for Customer, Employee, and Delivery Partner personnel to manage and fulfill customer orders.",
                "full_description": (
                    "Insta Wash Clean is a cross-platform laundry service application unifying three distinct operational "
                    "roles — Customer, Employee, and Delivery Partner — inside a single Flutter codebase. Each role "
                    "receives tailored login flows, dashboards, and order fulfillment screens."
                ),
                "contribution": [
                    "Developed and deployed a cross-platform laundry service application for Android and iOS.",
                    "Built the mobile frontend with a responsive and user-friendly interface.",
                    "Managed 3 role-based login logics, flows, and screens within a single application.",
                ],
                "technologies": ["Flutter", "Dart", "REST API", "GetX", "Node.js"],
                "cover_image": "/assets/projects/insta-wash-clean/insta_wash_clean_promotional_mockup.webp",
                "gallery_images": [],
                "google_play_url": "https://play.google.com/store/apps/details?id=com.dhandabadhao.laundry_delivery",
                "app_store_url": "https://apps.apple.com/in/app/insta-wash-clean/id6769475965",
                "github_url": "",
                "live_url": "",
                "extra_links": [],
                "is_featured": True,
                "is_published": True,
                "order": 3,
                "accent_color": "#2563EB",
            },
            {
                "title": "Healthcare Appointment Platform",
                "slug": "healthcare-appointment-platform",
                "subtitle": "Amina Healthcare & IMH Hospital · Telemedicine",
                "category": "Healthcare",
                "industry_badge": "HEALTHCARE · TELEMEDICINE",
                "short_description": "Hospital appointment booking platforms for patient registration, specialization-based doctor search, and audio/video or in-person consultations.",
                "full_description": (
                    "Production telemedicine and hospital appointment booking platforms built for Amina Healthcare "
                    "and IMH Hospital. Enables patients to register, search specialists, pay securely for consultations, "
                    "and connect with doctors via real-time audio/video calls or schedule in-person visits."
                ),
                "contribution": [
                    "Integrated Razorpay for secure consultation payments and Agora SDK for real-time audio/video calls.",
                    "Implemented patient registration, specialization-based doctor discovery, and appointment scheduling.",
                    "Published IMH Hospital on Google Play Store and Apple App Store.",
                ],
                "technologies": ["Flutter", "Java Spring Boot", "Razorpay", "Agora SDK"],
                "cover_image": "",
                "gallery_images": [],
                "google_play_url": "https://play.google.com/store/apps/details?id=com.docterz.connect.imhhospital",
                "app_store_url": "https://apps.apple.com/in/app/imh-hospital/id6757684452",
                "github_url": "",
                "live_url": "",
                "extra_links": [],
                "is_featured": True,
                "is_published": True,
                "order": 4,
                "accent_color": "#B68B50",
            },
            {
                "title": "NFPL Finance",
                "slug": "nfpl-finance",
                "subtitle": "FinTech / Loan Management",
                "category": "FinTech",
                "industry_badge": "FINTECH · LOAN MANAGEMENT",
                "short_description": "Loan management application with a digital eligibility and disbursement workflow.",
                "full_description": (
                    "NFPL Finance digitizes end-to-end loan onboarding, identity verification, creditworthiness checks, "
                    "and disbursement workflows on mobile, connected to a Java Spring Boot backend."
                ),
                "contribution": [
                    "Implemented Aadhaar and PAN identity verification workflows.",
                    "Integrated CIBIL score checks to drive automated eligibility, approval, and disbursement decisions.",
                ],
                "technologies": ["Flutter", "Java Spring Boot", "Aadhaar/PAN KYC", "CIBIL Integration"],
                "cover_image": "",
                "gallery_images": [],
                "google_play_url": "",
                "app_store_url": "",
                "github_url": "",
                "live_url": "",
                "extra_links": [],
                "is_featured": True,
                "is_published": True,
                "order": 5,
                "accent_color": "#C9A15E",
            },
            {
                "title": "PeeVee Bidding Platform",
                "slug": "peevee-bidding-platform",
                "subtitle": "B2B / Textile Procurement",
                "category": "B2B & Enterprise",
                "industry_badge": "B2B · TEXTILE PROCUREMENT",
                "short_description": "Bidding platform connecting textile manufacturers with raw-material vendors for transparent procurement.",
                "full_description": (
                    "PeeVee Bidding Platform streamlines raw-material procurement for textile manufacturers by enabling "
                    "structured requirement broadcasts, time-bound competitive vendor bidding, and transparent post-bid negotiation."
                ),
                "contribution": [
                    "Built admin requirement broadcasts, time-limited vendor bidding, post-bid negotiation, and sorted bid lists.",
                    "Published the production mobile application on Google Play Store.",
                ],
                "technologies": ["Flutter", "Laravel", "REST API"],
                "cover_image": "",
                "gallery_images": [],
                "google_play_url": "",
                "app_store_url": "",
                "github_url": "",
                "live_url": "",
                "extra_links": [],
                "is_featured": True,
                "is_published": True,
                "order": 6,
                "accent_color": "#B68B50",
            },
            {
                "title": "Niyojak",
                "slug": "niyojak",
                "subtitle": "Organizational Data Management",
                "category": "B2B & Enterprise",
                "industry_badge": "ORGANIZATIONAL DATA MANAGEMENT",
                "short_description": "Data management app for tracking organizational activities, attendance, and reporting.",
                "full_description": (
                    "Niyojak is a cross-platform organizational management application backed by .NET APIs, "
                    "providing structured workflows for member registration, attendance tracking, activity logging, "
                    "and automated survey report generation."
                ),
                "contribution": [
                    "Built attendance and activity tracking, member registration, and survey report generation modules.",
                    "Published on both Google Play Store and Apple App Store.",
                ],
                "technologies": ["Flutter", ".NET", "REST API"],
                "cover_image": "",
                "gallery_images": [],
                "google_play_url": "https://play.google.com/store/apps/details?id=com.softiq.niyojak_prod",
                "app_store_url": "https://apps.apple.com/in/app/niyojak/id6451251464",
                "github_url": "",
                "live_url": "",
                "extra_links": [],
                "is_featured": False,
                "is_published": True,
                "order": 7,
                "accent_color": "#D8B779",
            },
            {
                "title": "Vidyamate School ERP",
                "slug": "vidyamate-school-erp",
                "subtitle": "EdTech / School Management",
                "category": "Education",
                "industry_badge": "EDTECH · SCHOOL MANAGEMENT",
                "short_description": "Teacher-facing app for attendance, timetable management, and homework assignment.",
                "full_description": (
                    "Vidyamate School ERP equips educators with a fast mobile companion for daily classroom operations — "
                    "syncing attendance, timetables, and homework assignments in real time across connected student and parent apps."
                ),
                "contribution": [
                    "Built real-time sync of attendance, timetable, and homework data across student and parent apps.",
                    "Published the teacher-facing Flutter application on Google Play Store.",
                ],
                "technologies": ["Flutter", "Python", "Real-Time Sync"],
                "cover_image": "",
                "gallery_images": [],
                "google_play_url": "https://play.google.com/store/apps/details?id=com.app.vidyamate_teacher",
                "app_store_url": "",
                "github_url": "",
                "live_url": "",
                "extra_links": [],
                "is_featured": False,
                "is_published": True,
                "order": 8,
                "accent_color": "#B68B50",
            },
            {
                "title": "Toiloo",
                "slug": "toiloo",
                "subtitle": "Public Utility / Location Services",
                "category": "Consumer & Utility",
                "industry_badge": "PUBLIC UTILITY · LOCATION SERVICES",
                "short_description": "Public utility app to help users locate nearby restrooms with community ratings.",
                "full_description": (
                    "Toiloo is a location-aware public utility mobile app helping commuters and travelers quickly discover "
                    "nearby public restrooms backed by Google Maps search and community-driven hygiene ratings."
                ),
                "contribution": [
                    "Integrated Google Maps for location-based search and nearby facility discovery.",
                    "Implemented community ratings and reviews for listed restroom facilities.",
                ],
                "technologies": ["Flutter", "PHP/MySQL", "Google Maps"],
                "cover_image": "",
                "gallery_images": [],
                "google_play_url": "",
                "app_store_url": "",
                "github_url": "",
                "live_url": "",
                "extra_links": [],
                "is_featured": False,
                "is_published": True,
                "order": 9,
                "accent_color": "#C9A15E",
            },
            {
                "title": "Mass-Screening",
                "slug": "mass-screening",
                "subtitle": "Healthcare / Field Data Collection",
                "category": "Healthcare",
                "industry_badge": "HEALTHCARE · FIELD DATA COLLECTION",
                "short_description": "Offline-first healthcare survey app built for large-scale field data collection.",
                "full_description": (
                    "Mass-Screening was engineered for healthcare field teams operating in low-connectivity regions, "
                    "ensuring zero data loss during large-scale medical surveys through reliable local persistence "
                    "and automatic synchronization once connectivity is restored."
                ),
                "contribution": [
                    "Designed offline-first data capture with sync-on-connect for reliable operation in low-connectivity field conditions.",
                    "Integrated structured survey forms with a Python backend.",
                ],
                "technologies": ["Flutter", "Python", "Offline-First Sync"],
                "cover_image": "",
                "gallery_images": [],
                "google_play_url": "",
                "app_store_url": "",
                "github_url": "",
                "live_url": "",
                "extra_links": [],
                "is_featured": False,
                "is_published": True,
                "order": 10,
                "accent_color": "#B68B50",
            },
            {
                "title": "Gotmare Matrimonial & RVB Matrimony",
                "slug": "gotmare-matrimonial-rvb-matrimony",
                "subtitle": "Matrimonial Platforms",
                "category": "Consumer & Utility",
                "industry_badge": "MATRIMONIAL PLATFORMS",
                "short_description": "Matrimonial platforms for profile matching, advanced partner search, and real-time chat.",
                "full_description": (
                    "Dedicated community matrimonial mobile platforms (Gotmare Matrimonial and RVB Matrimony) "
                    "built with Flutter, Framework7, Firebase, and PHP/MySQL to deliver secure profile discovery, "
                    "multi-criteria partner search, and real-time messaging."
                ),
                "contribution": [
                    "Implemented Firebase real-time chat and advanced search filters for profile matching.",
                    "Published both Gotmare Matrimonial and RVB Matrimony on Google Play Store.",
                ],
                "technologies": ["Flutter", "Framework7", "PHP/MySQL", "Firebase"],
                "cover_image": "",
                "gallery_images": [],
                "google_play_url": "https://play.google.com/store/apps/details?id=com.gotmarematrimony.mytecsys",
                "app_store_url": "",
                "github_url": "",
                "live_url": "",
                "extra_links": [
                    {
                        "label": "Gotmare Matrimonial (Play Store)",
                        "platform": "google_play",
                        "url": "https://play.google.com/store/apps/details?id=com.gotmarematrimony.mytecsys",
                    },
                    {
                        "label": "RVB Matrimony (Play Store)",
                        "platform": "google_play",
                        "url": "https://play.google.com/store/apps/details?id=com.rvbmtrimony.mytecsys",
                    },
                ],
                "is_featured": False,
                "is_published": True,
                "order": 11,
                "accent_color": "#D8B779",
            },
        ]
        for proj in projects_seed:
            proj["created_at"] = ts
            proj["updated_at"] = ts
        await db.projects.insert_many(projects_seed)

    # 6. Education
    if await db.education.count_documents({}) == 0:
        await db.education.insert_many(
            [
                {
                    "degree": "Bachelor in Vocational",
                    "institution": "Kamla Nehru Mahavidyalaya",
                    "location": "Nagpur",
                    "duration": "June 2016 – March 2019",
                    "description": "",
                    "order": 1,
                    "is_visible": True,
                    "created_at": ts,
                    "updated_at": ts,
                },
                {
                    "degree": "Higher Secondary Certificate (HSC)",
                    "institution": "Vandemataram Vidyalaya",
                    "location": "Nagpur",
                    "duration": "June 2015 – March 2016",
                    "description": "",
                    "order": 2,
                    "is_visible": True,
                    "created_at": ts,
                    "updated_at": ts,
                },
                {
                    "degree": "Secondary School Certificate (SSC)",
                    "institution": "New English High School",
                    "location": "Nagpur",
                    "duration": "June 2013 – March 2014",
                    "description": "",
                    "order": 3,
                    "is_visible": True,
                    "created_at": ts,
                    "updated_at": ts,
                },
            ]
        )

    # 7. Achievements
    if await db.achievements.count_documents({}) == 0:
        await db.achievements.insert_many(
            [
                {
                    "badge": "10+",
                    "title": "Production Applications Delivered",
                    "description": "Delivered 10+ production-grade Flutter applications across healthcare, fintech, e-commerce, education, and logistics domains, published on Google Play Store and Apple App Store.",
                    "is_published": True,
                    "order": 1,
                    "created_at": ts,
                    "updated_at": ts,
                },
                {
                    "badge": "PAY",
                    "title": "Payments & Identity Verification",
                    "description": "Integrated secure payment (Razorpay) and identity verification (Aadhaar, PAN, CIBIL) workflows into live financial and healthcare products.",
                    "is_published": True,
                    "order": 2,
                    "created_at": ts,
                    "updated_at": ts,
                },
                {
                    "badge": "RT",
                    "title": "Real-Time Communication Systems",
                    "description": "Built real-time communication features (Firebase chat, Agora audio/video calling) deployed across multiple production apps.",
                    "is_published": True,
                    "order": 3,
                    "created_at": ts,
                    "updated_at": ts,
                },
                {
                    "badge": "E2E",
                    "title": "End-to-End Project Ownership",
                    "description": "Owned end-to-end project lifecycle — from client requirement gathering to store deployment — across 10+ client engagements.",
                    "is_published": True,
                    "order": 4,
                    "created_at": ts,
                    "updated_at": ts,
                },
                {
                    "badge": "5",
                    "title": "Cross-Functional Backend Collaboration",
                    "description": "Collaborated cross-functionally with backend teams spanning PHP, Java Spring Boot, .NET, Laravel, and Python stacks.",
                    "is_published": True,
                    "order": 5,
                    "created_at": ts,
                    "updated_at": ts,
                },
            ]
        )

    # 8. Website Settings
    if await db.website_settings.count_documents({}) == 0:
        await db.website_settings.insert_one(
            {
                "site_title": "Onkar Bhalane — Flutter Developer | Mobile Application Engineer",
                "logo_text": "OB",
                "logo_url": "",
                "favicon_url": "/favicon.svg",
                "primary_accent": "#B68B50",
                "secondary_accent": "#D8B779",
                "animations_enabled": True,
                "custom_cursor_enabled": True,
                "maintenance_mode": False,
                "maintenance_message": "Portfolio is currently undergoing scheduled maintenance. Please check back shortly.",
                "seo_description": "Portfolio of Onkar Bhalane — Flutter Developer with 4+ years of experience shipping 10+ production Android & iOS applications.",
                "seo_keywords": "Onkar Bhalane, Flutter Developer, Mobile Application Engineer, Dart, GetX, Android, iOS, Nagpur",
                "og_image": "/assets/social-media/og_hero_banner.webp",
                "analytics_enabled": True,
                "ga_measurement_id": "",
                "footer_tagline": "Crafting production-grade mobile experiences for Android & iOS.",
                "copyright_text": "© 2026 Onkar Bhalane. All rights reserved.",
                "sections": [
                    {"key": "hero", "label": "Hero", "is_visible": True, "order": 1},
                    {"key": "about", "label": "About Me", "is_visible": True, "order": 2},
                    {"key": "skills", "label": "Technical Expertise", "is_visible": True, "order": 3},
                    {"key": "experience", "label": "Professional Experience", "is_visible": True, "order": 4},
                    {"key": "projects", "label": "Featured Projects", "is_visible": True, "order": 5},
                    {"key": "achievements", "label": "Achievements", "is_visible": True, "order": 6},
                    {"key": "education", "label": "Education", "is_visible": True, "order": 7},
                    {"key": "contact", "label": "Contact", "is_visible": True, "order": 8},
                ],
                "created_at": ts,
                "updated_at": ts,
            }
        )

    # 9. Idempotent V1 Asset Backfill (fills empty image fields on existing Atlas DBs without overwriting admin uploads)
    profile_doc = await db.profiles.find_one({})
    if profile_doc:
        profile_patch = {}
        defaults = {
            "profile_image": "/assets/portraits/portrait_corporate_black_suit_gold_tie.webp",
            "about_image": "/assets/portraits/portrait_cinematic_black_turtleneck.webp",
            "secondary_portrait": "/assets/portraits/portrait_editorial_seated_black_suit.webp",
            "contact_image": "/assets/portraits/portrait_editorial_thoughtful_black_blazer.webp",
            "hero_background_image": "/assets/backgrounds/hero_portrait_wide_composition.webp",
        }
        for key, val in defaults.items():
            if not profile_doc.get(key):
                profile_patch[key] = val
        if profile_patch:
            profile_patch["updated_at"] = ts
            await db.profiles.update_one({"_id": profile_doc["_id"]}, {"$set": profile_patch})

    project_asset_defaults = {
        "purti-super-bazar": {
            "cover_image": "/assets/projects/purti-super-bazar/purti_super_bazar_promotional_mockup.webp",
            "accent_color": "#B68B50",
        },
        "purti-delivery-partner": {
            "cover_image": "/assets/projects/purti-delivery-partner/02_assigned_orders.jpg",
            "gallery_images": [
                "/assets/projects/purti-delivery-partner/02_assigned_orders.jpg",
                "/assets/projects/purti-delivery-partner/03_order_details_navigation.jpg",
                "/assets/projects/purti-delivery-partner/04_item_verification_payment.jpg",
                "/assets/projects/purti-delivery-partner/05_delivery_status_timeline.jpg",
                "/assets/projects/purti-delivery-partner/06_cash_settlement_confirmation.jpg",
                "/assets/projects/purti-delivery-partner/07_order_completed.jpg",
                "/assets/projects/purti-delivery-partner/08_past_orders.jpg",
                "/assets/projects/purti-delivery-partner/01_splash_screen.jpg",
            ],
            "accent_color": "#10B981",
        },
        "insta-wash-clean": {
            "cover_image": "/assets/projects/insta-wash-clean/insta_wash_clean_promotional_mockup.webp",
            "accent_color": "#2563EB",
        },
    }
    for slug, asset_cfg in project_asset_defaults.items():
        proj_doc = await db.projects.find_one({"slug": slug})
        if proj_doc:
            patch = {}
            if not proj_doc.get("cover_image") and asset_cfg.get("cover_image"):
                patch["cover_image"] = asset_cfg["cover_image"]
                if asset_cfg.get("accent_color"):
                    patch["accent_color"] = asset_cfg["accent_color"]
            if not proj_doc.get("gallery_images") and asset_cfg.get("gallery_images"):
                patch["gallery_images"] = asset_cfg["gallery_images"]
            if patch:
                patch["updated_at"] = ts
                await db.projects.update_one({"_id": proj_doc["_id"]}, {"$set": patch})

    settings_doc = await db.website_settings.find_one({})
    if settings_doc and not settings_doc.get("og_image"):
        await db.website_settings.update_one(
            {"_id": settings_doc["_id"]},
            {"$set": {"og_image": "/assets/social-media/og_hero_banner.webp", "updated_at": ts}},
        )
