# Hostinger Deployment Guide

## Prerequisites

Your app requires **Node.js hosting** because it uses:
- Server Actions
- Firebase Firestore (server-side)
- Dynamic routes
- Session management

---

## Option 1: Hostinger Node.js Hosting (Recommended)

### Step 1: Prepare Your App for Production

1. Build your app locally to test:
```bash
npm run build
npm start
```

2. If build is successful, continue to deployment.

---

### Step 2: Upload to Hostinger

#### A. Using Git (Easiest)

1. Go to Hostinger Panel
2. Navigate to **Advanced** → **Git**
3. Click **Create Repository**
4. Connect your GitHub repo: `https://github.com/arsh077/siteleads`
5. Select branch: `main`
6. Hostinger will clone your repo

#### B. Using FTP/File Manager

1. Build your app locally:
```bash
npm run build
```

2. Upload these files/folders to Hostinger:
   - `/app` folder
   - `/public` folder
   - `/.next` folder (after build)
   - `/node_modules` folder (or install on server)
   - `package.json`
   - `package-lock.json`
   - `next.config.mjs`
   - `tsconfig.json`
   - `.env` file (with your environment variables)

---

### Step 3: Configure Environment Variables on Hostinger

Go to Hostinger Panel → **Advanced** → **Environment Variables**

Add these variables:

```bash
NODE_ENV=production

SESSION_SECRET=ds97tXmabMdsRFjvAC3xuiFVhUMqpGXK2BLPWwIJaL8=

NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBcBWJ15MUaRCA-nYVjA0eP-3AJpJPCYuI
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=trademark-leads-c9c74.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=trademark-leads-c9c74
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=trademark-leads-c9c74.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=947440956590
NEXT_PUBLIC_FIREBASE_APP_ID=1:947440956590:web:b44caedd63b8b41156e93f
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-YWPZPBKLT9

APP_URL=https://yourdomain.com

FIREBASE_SERVICE_ACCOUNT_KEY=[Paste your Firebase service account JSON here - get from Firebase Console]
```

**⚠️ Note**: For FIREBASE_SERVICE_ACCOUNT_KEY, download the service account JSON from Firebase Console and paste the entire JSON content.

---

### Step 4: Install Dependencies on Server

SSH into your Hostinger server:

```bash
cd /path/to/your/app
npm install --production
```

---

### Step 5: Build and Start the App

```bash
npm run build
npm start
```

Or for production with PM2 (recommended):

```bash
npm install -g pm2
pm2 start npm --name "siteleads" -- start
pm2 save
pm2 startup
```

---

### Step 6: Configure Domain

1. Go to Hostinger Panel → **Domains**
2. Point your domain to the Node.js app
3. Update `APP_URL` environment variable with your domain

---

## Option 2: Alternative - Use Vercel (Easier)

Since Next.js works best on Vercel (which you already have setup), and it's free, I recommend sticking with Vercel:

**Current Vercel URL**: https://siteleads-seven.vercel.app

If you want a custom domain:
1. Buy domain from Hostinger
2. Point DNS to Vercel
3. Add domain in Vercel dashboard

This is much easier than managing Node.js hosting!

---

## Option 3: Docker Deployment on Hostinger

If Hostinger supports Docker, here's a Dockerfile:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and deploy:
```bash
docker build -t siteleads .
docker run -p 3000:3000 --env-file .env siteleads
```

---

## Recommended Approach

**Use Vercel** (already setup) with custom domain from Hostinger:

1. Keep app on Vercel: https://siteleads-seven.vercel.app
2. Buy domain from Hostinger
3. Update Hostinger DNS to point to Vercel
4. Add custom domain in Vercel dashboard

**Benefits**:
- ✅ No server management
- ✅ Auto-scaling
- ✅ Free SSL
- ✅ Automatic deployments
- ✅ Better performance (CDN)

---

## Hostinger Requirements Check

Before deploying to Hostinger, verify your plan supports:
- ✅ Node.js v18 or higher
- ✅ npm/yarn
- ✅ SSH access
- ✅ Environment variables
- ✅ Custom domains
- ✅ SSL certificates

If your Hostinger plan doesn't support Node.js, stick with **Vercel + Custom Domain**.
