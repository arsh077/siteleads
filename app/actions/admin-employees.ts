'use server';

import { revalidatePath } from 'next/cache';
import { createEmployee, toggleUserStatus, updateUserCredentials } from '../lib/db';

export async function createEmployeeAction(prevState: { error: string; success?: string }, formData: FormData) {
  const name = formData.get('name') as string | null;
  const username = formData.get('username') as string | null;
  const password = formData.get('password') as string | null;

  if (!name || !name.trim()) {
    return { error: 'Employee name is required.' };
  }
  if (!username || !username.trim()) {
    return { error: 'Username is required.' };
  }
  if (!password || !password.trim()) {
    return { error: 'Password is required.' };
  }

  try {
    createEmployee(name.trim(), username.toLowerCase().trim(), password.trim());
    revalidatePath('/admin/employees');
    return { error: '', success: `Employee "${name.trim()}" registered successfully!` };
  } catch (err: any) {
    return { error: err.message || 'Failed to create employee.' };
  }
}

export async function toggleEmployeeStatusAction(userId: string) {
  try {
    toggleUserStatus(userId);
    revalidatePath('/admin/employees');
    return { success: true };
  } catch (err: any) {
    throw new Error(err.message || 'Failed to toggle status.');
  }
}

export async function updateEmployeeAction(
  prevState: { error: string; success?: string },
  formData: FormData
) {
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const username = formData.get('username') as string;
  const password = formData.get('password') as string | null;

  if (!id) {
    return { error: 'Employee ID is required.' };
  }
  if (!name || !name.trim()) {
    return { error: 'Name is required.' };
  }
  if (!username || !username.trim()) {
    return { error: 'Username is required.' };
  }

  try {
    updateUserCredentials(
      id,
      name.trim(),
      username.toLowerCase().trim(),
      password && password.trim() ? password.trim() : undefined
    );
    revalidatePath('/admin/employees');
    revalidatePath('/admin');
    return { error: '', success: 'Account credentials updated successfully!' };
  } catch (err: any) {
    return { error: err.message || 'Failed to update credentials.' };
  }
}
