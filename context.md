# LeadFlow Equal Distributor MVP Context

## Product summary
LeadFlow is a mobile-friendly web app where an admin can upload or paste lead screenshots, convert them into lead records, and distribute those leads equally among active employees using deterministic logic rather than AI.

## Roles
- Admin: manages employees, batches, uploads, assignments, and own credentials.
- Employee: logs in, views assigned leads, updates lead response sheet, and manages own credentials.

## Constraints
- No AI-based lead assignment.
- Equal logical distribution only.
- Must run on phone and laptop.
- Poppins font throughout.
- Familiar, Facebook-like login simplicity without copying branding.

## Core MVP features
- Login/logout for admin and employees
- Role-based redirects
- Screenshot dump workflow (future implementation step)
- Lead review and equal assignment workflow (future implementation step)
- Employee lead dashboard (future implementation step)
- Response tracking sheet (future implementation step)
- Username/password change

## Performance rules
- Paginate lead lists
- Add indexes for common lead queries
- Compress image previews
- Lazy load offscreen content
- Keep auth/session payload minimal
