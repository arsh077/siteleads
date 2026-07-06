# Product Requirements Document

## 1. Overview
Product name: LeadFlow Equal Distributor MVP
One-liner: A simple web app to upload lead screenshot dumps, create lead records, and distribute them equally among employees.
Author: Perplexity
Last updated: 2026-07-05

## 2. Problem
Today, small business admins struggle with manually dividing incoming leads because the process is slow, unfair, and hard to track.
Existing solutions are often too complex, too expensive, or focused on full CRM workflows instead of quick lead assignment.

## 3. Target user
Primary: Small sales team admin who receives leads on phone or laptop and needs fast assignment.
Secondary: Employee or sales executive who only needs assigned leads and response tracking.

## 4. Goals
G1. Make lead upload-to-assignment fast and simple.
G2. Provide equal lead distribution using deterministic logic.
G3. Give employees a clean dashboard for response tracking.

## 5. Non-goals (v1)
- We will NOT build AI lead extraction or AI lead assignment.
- We will NOT build a full CRM, marketing automation, or multi-company SaaS system.

## 6. User stories
US1. As an admin, I want to upload lead screenshots so that I can convert them into lead records.
US2. As an admin, I want leads to be distributed equally so that workload stays balanced.
US3. As an employee, I want to see only my assigned leads so that I can work without confusion.
US4. As an employee, I want to maintain a response sheet so that follow-up history stays organized.
US5. As a user, I want to change my username and password so that my account stays secure.

## 7. Success metrics
M1. Admin can process and assign a normal lead batch in under 5 minutes.
M2. Every assigned lead has a visible current owner and response status.
M3. Employee dashboard remains usable on mobile through paginated data loading.

## 8. Risks & assumptions
- Assumption: Admin will review leads before final assignment.
- Risk: Duplicate leads may be created from multiple screenshots (mitigation: duplicate warnings).
- Risk: Inactive employees may receive leads if status is not maintained (mitigation: active-only assignment pool).
| Goal | User Story | Priority | Status |
|---|---|---|---|
| G1 | US1 | High | Planned |
| G2 | US2 | High | Planned |
| G3 | US3, US4 | High | Planned |
| G1 | US5 | Medium | Planned |
