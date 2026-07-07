# Vercel Environment Variables Setup

## 🔥 Add These to Vercel Dashboard

Go to: **Vercel Dashboard** → **Your Project** → **Settings** → **Environment Variables**

---

## Required Variables:

### 1. SESSION_SECRET
```
ds97tXmabMdsRFjvAC3xuiFVhUMqpGXK2BLPWwIJaL8=
```
**Environment**: Production, Preview, Development

---

### 2. NEXT_PUBLIC_FIREBASE_API_KEY
```
AIzaSyBcBWJ15MUaRCA-nYVjA0eP-3AJpJPCYuI
```
**Environment**: Production, Preview, Development

---

### 3. NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
```
trademark-leads-c9c74.firebaseapp.com
```
**Environment**: Production, Preview, Development

---

### 4. NEXT_PUBLIC_FIREBASE_PROJECT_ID
```
trademark-leads-c9c74
```
**Environment**: Production, Preview, Development

---

### 5. NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
```
trademark-leads-c9c74.firebasestorage.app
```
**Environment**: Production, Preview, Development

---

### 6. NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
```
947440956590
```
**Environment**: Production, Preview, Development

---

### 7. NEXT_PUBLIC_FIREBASE_APP_ID
```
1:947440956590:web:b44caedd63b8b41156e93f
```
**Environment**: Production, Preview, Development

---

### 8. NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
```
G-YWPZPBKLT9
```
**Environment**: Production, Preview, Development

---

### 9. APP_URL
```
https://siteleads-seven.vercel.app
```
**Environment**: Production

---

## 📋 Quick Copy-Paste (for CLI or bulk import)

```bash
SESSION_SECRET="ds97tXmabMdsRFjvAC3xuiFVhUMqpGXK2BLPWwIJaL8="
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyBcBWJ15MUaRCA-nYVjA0eP-3AJpJPCYuI"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="trademark-leads-c9c74.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="trademark-leads-c9c74"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="trademark-leads-c9c74.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="947440956590"
NEXT_PUBLIC_FIREBASE_APP_ID="1:947440956590:web:b44caedd63b8b41156e93f"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="G-YWPZPBKLT9"
APP_URL="https://siteleads-seven.vercel.app"
```

---

## ✅ After Adding Variables

1. Go to **Deployments** tab
2. Click on latest deployment's menu (⋯)
3. Click **Redeploy**
4. Wait for deployment to complete
5. Test your app!

---

## 🔥 One More Step: Enable Firestore

1. Go to **Firebase Console**: https://console.firebase.google.com
2. Select project: **trademark-leads-c9c74**
3. Go to **Firestore Database** (left sidebar)
4. Click **"Create Database"**
5. Select **"Start in test mode"** (for now)
6. Choose location: **us-central** (or closest to you)
7. Click **"Enable"**

---

## 🎉 Done!

Your app will now:
- ✅ Connect to Firebase Firestore
- ✅ Persist data across deployments
- ✅ Work perfectly on Vercel
- ✅ Auto-create default users

**Login**: `admin` / `123` or `rohan` / `123`
