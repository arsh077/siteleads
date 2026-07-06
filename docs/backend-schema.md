# Backend Schema

## Entities
### users
id uuid pk
username text unique not null
password_hash text not null
role text not null -- admin | employee
display_name text
is_active bool default true
created_at timestamptz default now()
updated_at timestamptz default now()

### lead_batches
id uuid pk
created_by uuid fk -> users.id
source_type text -- upload | paste | camera
batch_status text -- draft | reviewed | assigned
created_at timestamptz default now()

### lead_images
id uuid pk
batch_id uuid fk -> lead_batches.id
file_path text not null
file_type text
preview_path text
created_at timestamptz default now()

### leads
id uuid pk
batch_id uuid fk -> lead_batches.id
full_name text
phone text
email text
city text
notes text
status text default 'new'
assigned_to uuid fk -> users.id
assigned_at timestamptz
created_at timestamptz default now()
updated_at timestamptz default now()

### lead_updates
id uuid pk
lead_id uuid fk -> leads.id
user_id uuid fk -> users.id
response_type text
response_note text
followup_at timestamptz
created_at timestamptz default now()

### assignment_runs
id uuid pk
batch_id uuid fk -> lead_batches.id
algorithm text default 'equal_round_robin'
employee_count int
total_leads int
created_by uuid fk -> users.id
created_at timestamptz default now()

## Relationships
- One user can create many lead batches.
- One batch can have many uploaded screenshots.
- One batch can produce many leads.
- One lead can have many updates.
- One employee can own many assigned leads.

## Indexes
- users(username)
- users(role, is_active)
- lead_batches(created_by, created_at desc)
- leads(assigned_to, updated_at desc)
- leads(status, updated_at desc)
- leads(batch_id)
- leads(phone)
- lead_updates(lead_id, created_at desc)

## Auth model
- Admin can access all users, batches, leads, assignment actions, and own settings.
- Employee can access only assigned leads, own updates, and own settings.

## API endpoints
POST /api/auth/login
POST /api/auth/logout
PATCH /api/me/credentials
GET /api/admin/employees
POST /api/admin/employees
PATCH /api/admin/employees/:id
POST /api/admin/batches
POST /api/admin/batches/:id/images
POST /api/admin/batches/:id/leads
POST /api/admin/batches/:id/assign
GET /api/admin/leads
GET /api/employee/leads
GET /api/leads/:id
POST /api/leads/:id/updates

## Storage
- Screenshot originals stored in object storage
- Compressed previews stored separately for faster rendering

## Seed data
- 1 admin
- 3 employees
- 1 demo batch
- 12 sample leads
- Sample lead updates across statuses
