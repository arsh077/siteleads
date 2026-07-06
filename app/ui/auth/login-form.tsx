'use client';

import { useActionState } from 'react';
import { login } from '../../actions/auth';

const initialState = {
  error: '',
};

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, initialState);

  return (
    <form action={action} className="form-stack" noValidate>
      <label className="field">
        <span>Username</span>
        <input
          name="username"
          type="text"
          autoComplete="username"
          required
          aria-describedby={state.error ? 'login-error' : undefined}
        />
      </label>

      <label className="field">
        <span>Password</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-describedby={state.error ? 'login-error' : undefined}
        />
      </label>

      {state.error ? (
        <p id="login-error" className="form-error" role="alert">
          {state.error}
        </p>
      ) : null}

      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
}
