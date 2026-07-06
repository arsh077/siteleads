import { getCurrentUser } from '../lib/dal';
import { getUsers } from '../lib/db';
import Navbar from '../ui/navbar';
import ProfileForm from './profile-form';
import { ArrowLeft, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const sessionUser = await getCurrentUser();

  if (!sessionUser) {
    redirect('/login');
  }

  const dbUser = getUsers().find((u) => u.id === sessionUser.id);
  if (!dbUser) {
    redirect('/login');
  }

  const backLink = dbUser.role === 'admin' ? '/admin' : '/employee/leads';

  const mappedUser = {
    id: dbUser.id,
    username: dbUser.username,
    role: dbUser.role,
    displayName: dbUser.name
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC]">
      <Navbar activeTab="settings" />

      <main className="max-w-xl mx-auto p-4 sm:p-6 space-y-6">
        
        {/* Back navigation link */}
        <Link
          href={backLink}
          className="inline-flex items-center gap-2 text-xs text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* Header Title block */}
        <div className="glass-panel p-5 border border-white/10 shadow-xl space-y-2">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <UserCircle className="w-5 h-5 text-blue-400" />
            Manage My Profile
          </h1>
          <p className="text-xs text-white/60">
            Edit your display name, change your login username, or configure a new password.
          </p>
        </div>

        {/* Profile edit form component */}
        <ProfileForm user={mappedUser} />

      </main>
    </div>
  );
}
