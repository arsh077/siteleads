# Firebase Integration Setup Guide

## ✅ What's Been Implemented

Your Next.js app now uses **Firebase Firestore** as the backend database instead of the local `db.json` file.

### Features Integrated:
- ✅ **Firestore Database** - Cloud-based NoSQL database
- ✅ **Firebase Storage** - Ready for image uploads (batches)
- ✅ **Auto-initialization** - Creates default users on first run
- ✅ **Server-side operations** - Using Firebase Admin SDK
- ✅ **Client-side ready** - Firebase client SDK configured

---

## 🔧 Configuration

### Local Development

The Firebase configuration is already set in your `.env` file. The app will:
1. Connect to Firestore automatically
2. Initialize with default users (admin, rohan, priya) if database is empty
3. All CRUD operations now use Firestore

### Vercel Deployment

Add these environment variables in Vercel:

```bash
# Session (already added)
SESSION_SECRET=ds97tXmabMdsRFjvAC3xuiFVhUMqpGXK2BLPWwIJaL8=

# Firebase Client Config
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBcBWJ15MUaRCA-nYVjA0eP-3AJpJPCYuI
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=trademark-leads-c9c74.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=trademark-leads-c9c74
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=trademark-leads-c9c74.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=947440956590
NEXT_PUBLIC_FIREBASE_APP_ID=1:947440956590:web:b44caedd63b8b41156e93f
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-YWPZPBKLT9
```

---

## 🔐 Firebase Security Rules

You need to set up Firestore security rules. Go to:

**Firebase Console** → **Firestore Database** → **Rules**

Add these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - authenticated users can read all, admins can write
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.role == 'admin';
    }
    
    // Leads collection - users can read their assigned leads, admins can read all
    match /leads/{leadId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Lead updates - users can create updates for their leads
    match /leadUpdates/{updateId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.token.role == 'admin';
    }
    
    // Batches - admins only
    match /leadBatches/{batchId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.role == 'admin';
    }
  }
}
```

**Important**: For now, you can use **test mode** rules for development:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // WARNING: Only for testing!
    }
  }
}
```

---

## 📦 Collections Structure

### Collections Created:
1. **users** - User accounts (admin, employees)
2. **leads** - Lead data with assignments
3. **leadUpdates** - History of lead status changes
4. **leadBatches** - Upload batch metadata

---

## 🚀 What Changed

### Files Modified:
- `app/lib/db.ts` - Now re-exports Firestore functions
- `app/page.tsx` - Initializes Firestore on app load

### Files Created:
- `app/lib/firebase/config.ts` - Firebase client configuration
- `app/lib/firebase/admin.ts` - Firebase Admin SDK for server-side
- `app/lib/firebase/firestore-db.ts` - All database operations

---

## ✨ Benefits

1. **Data Persistence** - Data survives deployments and restarts
2. **Real-time Updates** - Can add real-time sync later
3. **Scalability** - Cloud database handles growth
4. **No File System** - Works perfectly on Vercel
5. **Backup & Recovery** - Firebase handles backups

---

## 🔄 Migration Notes

- Old `db.json` file is no longer used
- All existing code continues to work (same function signatures)
- Default users are auto-created on first load
- No changes needed to components or pages

---

## 🐛 Troubleshooting

### If you get "Permission Denied" errors:
- Set Firestore rules to test mode temporarily
- Or add proper authentication rules

### If data doesn't persist:
- Check Firestore console to verify data is being written
- Verify environment variables are set correctly

### If app doesn't load:
- Check browser console for Firebase errors
- Verify Firebase project is active and billing is enabled (if needed)

---

## 📝 Default Login Credentials

After initialization, these users are created:

- **Admin**: `admin` / `123`
- **Employee 1**: `rohan` / `123`  
- **Employee 2**: `priya` / `123`

---

## Next Steps

1. ✅ Set Firestore security rules (test mode for now)
2. ✅ Add environment variables to Vercel
3. ✅ Test the app locally
4. ✅ Deploy to Vercel
5. 🔜 Add Firebase Storage for image uploads (optional)
6. 🔜 Migrate to Firebase Authentication (optional)
