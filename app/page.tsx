import { redirect } from 'next/navigation';
import { getCurrentUser } from './lib/dal';
import { initializeFirestoreData } from './lib/db';

export default async function HomePage() {
  // Initialize Firestore with default data if empty
  try {
    await initializeFirestoreData();
  } catch (error) {
    console.error('Failed to initialize Firestore:', error);
  }

  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  redirect(user.role === 'admin' ? '/admin' : '/employee');
}
