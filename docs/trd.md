# Technical Requirements Document

## 1. Stack
Frontend: Next.js App Router, React, TypeScript
Backend: Next.js Server Actions and Route Handlers
Database: PostgreSQL
Auth: Custom credentials auth with secure cookie session
Hosting: Vercel or equivalent Node-compatible platform
Storage: Object storage for screenshots and compressed previews
AI: None for assignment

## 2. Architecture
Pattern: Monolith web application
Reason: Faster MVP delivery, fewer moving parts, simpler role-based authorization

## 3. Non-functional requirements
Performance: Initial dashboard render target under 2 seconds on common broadband, paginated API p95 under 400ms for common list views
Uptime: 99.5% target for MVP deployment
Security: HTTPS only, password hashing, secure cookies, role-based authorization, least-privilege data access
A11y: WCAG 2.1 AA baseline

## 4. Third-party services
| Service | Purpose | Pricing tier | Fallback |
|---------|---------|--------------|----------|
| Hosting | App deployment | Starter | Self-hosted Node server |
| Object storage | Screenshot storage | Starter/free | Local storage in dev only |
| Email | Optional reset flow | Optional | Admin manual reset |

## 5. Constraints
- Keep infrastructure and maintenance lean.
- Avoid unnecessary services and abstractions in v1.
- Must support both mobile and laptop usage.

## 6. Open questions
Q1. Will OCR be added later, or will screenshot review remain manual?
Q2. Should equal distribution be based on all-time assignments or current active lead load?
Q3. Will password reset be email-based or admin-managed only?
