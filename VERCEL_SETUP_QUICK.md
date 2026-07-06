# Quick Vercel Setup

## ⚠️ IMMEDIATE FIX FOR YOUR ERROR

The error you're seeing is because Vercel needs environment variables. Follow these steps:

### Step 1: Add Environment Variables in Vercel

1. Go to https://vercel.com/dashboard
2. Select your project: **siteleads-seven**
3. Click **Settings** → **Environment Variables**
4. Add these variables:

| Name | Value |
|------|-------|
| `SESSION_SECRET` | `your-secret-key-at-least-32-chars-long-12345678` |
| `APP_URL` | `https://siteleads-seven.vercel.app` |

### Step 2: Redeploy

After adding environment variables:
1. Go to **Deployments** tab
2. Click the **three dots** (⋯) next to your latest deployment
3. Click **Redeploy**

---

## ⚠️ IMPORTANT: Database Limitation

**Your app will load, but data WON'T be saved** because:
- Vercel has a read-only file system
- The current code uses `db.json` file (won't work)

### To Fix Data Persistence:

You need to migrate to a real database. Options:

1. **Vercel Postgres** (easiest)
   ```bash
   npm install @vercel/postgres
   ```

2. **MongoDB Atlas** (free tier available)
3. **Supabase** (free tier + auth)

---

## What I Fixed in Code:

- Added error handling for Vercel's read-only file system
- App will now load with default data on Vercel
- Local development still works normally

The app will now at least **load** on Vercel, but you'll need a real database for production use.
