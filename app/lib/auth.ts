import 'server-only';
import { getUsers, User } from './db';
import crypto from 'crypto';

export type AuthUser = User;

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function findUserByUsername(username: string): Promise<AuthUser | null> {
  const normalized = username.toLowerCase().trim();
  const users = getUsers();
  const user = users.find((u) => u.username === normalized);
  return user || null;
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const hashed = hashPassword(password);
  return hashed === hash || password === hash;
}

export function getRedirectPathByRole(role: 'admin' | 'employee'): string {
  return role === 'admin' ? '/admin' : '/employee';
}
