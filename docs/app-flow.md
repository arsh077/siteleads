# App Flow

## Screen inventory
| # | Screen | Auth? | Purpose |
|---|--------|-------|---------|
| 1 | Login | No | Sign in admin or employee |
| 2 | Admin dashboard | Yes (admin) | Overview, quick actions, workload |
| 3 | Upload dump | Yes (admin) | Upload, paste, or capture screenshot dump |
| 4 | Lead review table | Yes (admin) | Review and save lead records |
| 5 | Assignment review | Yes (admin) | Preview equal distribution before confirm |
| 6 | Employee management | Yes (admin) | Add, edit, activate, deactivate employees |
| 7 | Settings | Yes | Change username or password |
| 8 | Employee dashboard | Yes (employee) | View assigned leads |
| 9 | Lead detail / response sheet | Yes (employee) | Update response, notes, follow-up |
| 10 | Admin lead explorer | Yes (admin) | Search and filter all leads |

## States per screen
Each screen must define:
- Empty state
- Loading state
- Success state
- Error state
- Locked / permission denied state when relevant

## Happy path
Login -> Admin dashboard -> Upload dump -> Lead review -> Assignment preview -> Confirm assignment -> Employee login -> Assigned leads -> Response update

## Critical edge cases
EC1. Wrong credentials -> inline error
EC2. Upload succeeds but no valid lead rows -> editable empty review state
EC3. Inactive employee excluded from future assignments
EC4. Very large lead list -> paginated server-side loading only
EC5. Mobile upload interrupted -> retry flow or draft batch state
