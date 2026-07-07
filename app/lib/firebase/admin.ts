import 'server-only';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// Initialize Firebase Admin
if (getApps().length === 0) {
  // For production, use service account from environment variable
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      initializeApp({
        credential: cert(serviceAccount),
        projectId: 'trademark-leads-c9c74',
      });
    } catch (error) {
      console.error('Failed to parse Firebase service account:', error);
      // Fallback to basic initialization
      initializeApp({
        projectId: 'trademark-leads-c9c74',
      });
    }
  } else {
    // For development or Vercel preview, use basic initialization
    // This works with Application Default Credentials or Vercel's Firebase integration
    initializeApp({
      projectId: 'trademark-leads-c9c74',
    });
  }
}

export const adminDb = getFirestore();
export const adminAuth = getAuth();
