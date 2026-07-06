import 'server-only';

import { redirect } from 'next/navigation';
import { getSession } from './session';

export type CurrentUser = {
  id: string;
  role: 'admin' | 'employee';
  displayName?: string | null;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await getSession();

  if (!session) {
    return null;
  }

  return {
    id: session.userId,
    role: session.role,
    displayName: session.displayName,
  };
}

export async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  if (user.role !== 'admin') {
    redirect('/employee');
  }

  return user;
}

export async function requireEmployee() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  if (user.role !== 'employee') {
    redirect('/admin');
  }

  return user;
}
