# Vercel Deployment Guide

## Environment Variables

To deploy this application on Vercel, you need to add the following environment variables in your Vercel project settings:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

```
SESSION_SECRET=your-super-secret-key-at-least-32-characters-long
GEMINI_API_KEY=your-gemini-api-key (if needed)
APP_URL=https://your-app.vercel.app
```

## Important: Database Configuration

⚠️ **Critical Issue**: The current implementation uses a local JSON file (`db.json`) for data storage, which **will NOT work on Vercel** because:

- Vercel serverless functions have a **read-only file system**
- Data written during runtime is **not persisted** between requests
- Multiple serverless instances cannot share the same file

### Solutions:

#### Option 1: Use Vercel Postgres (Recommended)
```bash
npm install @vercel/postgres
```

Then update `app/lib/db.ts` to use Vercel Postgres instead of JSON file.

#### Option 2: Use MongoDB Atlas
```bash
npm install mongodb
```

Connect to a MongoDB Atlas database for persistent storage.

#### Option 3: Use Supabase
```bash
npm install @supabase/supabase-js
```

Use Supabase for both database and authentication.

#### Option 4: Deploy on a Platform with Persistent Storage
Consider deploying on platforms like:
- Railway
- Render
- DigitalOcean App Platform
- AWS EC2 / Azure VM

## Current Workaround

The code now has error handling for write operations, but **data will not persist** on Vercel. For a production deployment, you **must** migrate to a real database solution.

## Steps to Deploy

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables (as listed above)
4. Deploy
5. **Note**: You'll need to migrate to a real database for production use
