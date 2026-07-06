import 'server-only';

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export function validateLoginInput(input: {
  username: any;
  password: any;
}): ValidationResult<{ username: string; password: string }> {
  const username = typeof input.username === 'string' ? input.username.trim() : '';
  const password = typeof input.password === 'string' ? input.password : '';

  if (!username) {
    return { success: false, error: 'Username is required.' };
  }

  if (!password) {
    return { success: false, error: 'Password is required.' };
  }

  if (password.length < 3) {
    return { success: false, error: 'Password must be at least 3 characters long.' };
  }

  return {
    success: true,
    data: { username, password },
  };
}
