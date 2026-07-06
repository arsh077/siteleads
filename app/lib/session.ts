import 'server-only';

import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'leadflow_session';
const secret = new TextEncoder().encode(process.env.SESSION_SECRET || 'dev-only-change-me');

export type SessionPayload = {
  userId: string;
  role: 'admin' | 'employee';
  displayName?: string | null;
  expiresAt: string;
};

function getExpiryDate() {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date;
}

async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
}

export async function decrypt(token: string | undefined = ''): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ['HS256'],
    });

    return payload as SessionPayload;
  } catch {
    return null;
  }
}

export async function createSession({
  userId,
  role,
  displayName,
}: {
  userId: string;
  role: 'admin' | 'employee';
  displayName?: string | null;
}) {
  const expires = getExpiryDate();
  const token = await encrypt({
    userId,
    role,
    displayName,
    expiresAt: expires.toISOString(),
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires,
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return decrypt(token);
}
