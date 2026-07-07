'use server';

import { redirect } from 'next/navigation';
import { createSession, deleteSession } from '../lib/session';
import { validateLoginInput } from '../lib/validators';
import { findUserByUsername, verifyPassword, getRedirectPathByRole } from '../lib/auth';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '../lib/dal';

export async function login(_: { error: string }, formData: FormData) {
  const username = formData.get('username') as string | null;
  const password = formData.get('password') as string | null;

  const parsed = validateLoginInput({
    username,
    password,
  });

  if (parsed.success === false) {
    return { error: parsed.error };
  }

  const user = await findUserByUsername(parsed.data.username);

  if (!user || !user.isActive) {
    return { error: 'Invalid username or password.' };
  }

  const isValid = await verifyPassword(parsed.data.password, user.passwordHash);

  if (!isValid) {
    return { error: 'Invalid username or password.' };
  }

  await createSession({
    userId: user.id,
    role: user.role,
    displayName: user.name,
  });

  redirect(getRedirectPathByRole(user.role));
}

export async function logout() {
  await deleteSession();
  redirect('/login');
}

export async function updateProfileAction(
  _: { error: string; success?: string },
  formData: FormData
) {
  const name = formData.get('name') as string | null;
  const username = formData.get('username') as string | null;
  const password = formData.get('password') as string | null;

  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return { error: 'Authentication required.' };
  }

  if (!name || !name.trim()) {
    return { error: 'Name is required.' };
  }
  if (!username || !username.trim()) {
    return { error: 'Username is required.' };
  }

  try {
    const { updateUserCredentials } = await import('../lib/db');
    await updateUserCredentials(
      currentUser.id,
      name.trim(),
      username.toLowerCase().trim(),
      password && password.trim() ? password.trim() : undefined
    );

    await createSession({
      userId: currentUser.id,
      role: currentUser.role,
      displayName: name.trim(),
    });

    revalidatePath('/profile');
    revalidatePath('/admin');
    revalidatePath('/employee/leads');

    return { error: '', success: 'Your profile has been updated successfully!' };
  } catch (err: any) {
    return { error: err.message || 'Failed to update profile.' };
  }
}

export async function registerAction(
  prevState: { error: string; success?: string },
  formData: FormData
) {
  const name = formData.get('name') as string | null;
  const username = formData.get('username') as string | null;
  const password = formData.get('password') as string | null;

  if (!name || !name.trim()) {
    return { error: 'Full Name is required.' };
  }
  if (!username || !username.trim()) {
    return { error: 'Username is required.' };
  }
  if (!password || !password.trim()) {
    return { error: 'Password is required.' };
  }

  try {
    const { createEmployee } = await import('../lib/db');
    const user = createEmployee(name.trim(), username.toLowerCase().trim(), password.trim());
    
    await createSession({
      userId: user.id,
      role: user.role,
      displayName: user.name,
    });

    redirect('/employee/leads');
  } catch (err: any) {
    return { error: err.message || 'Registration failed.' };
  }
}
