'use client';

import { useState, useActionState } from 'react';
import { login, registerAction } from '../actions/auth';

const initialLoginState = { error: '' };
const initialRegisterState = { error: '' };

export default function LoginPage() {
  const [isToggled, setIsToggled] = useState(false);

  const [loginState, loginFormAction, loginPending] = useActionState(login, initialLoginState);
  const [registerState, registerFormAction, registerPending] = useActionState(registerAction, initialRegisterState);

  return (
    <>
      <div className={`auth-wrapper ${isToggled ? 'toggled' : ''}`}>
        <div className="background-shape"></div>
        <div className="secondary-shape"></div>

        {/* LOGIN SECTION */}
        <div className="credentials-panel signin">
          <div className="slide-element mb-3 flex items-center justify-start">
            <img src="/logo.png" alt="Legal Success India" className="h-14 w-14 rounded-full object-cover invert brightness-125" />
          </div>
          <h2 className="slide-element">Login</h2>
          <form action={loginFormAction} className="form-stack" noValidate>
            <div className="field-wrapper slide-element">
              <input type="text" name="username" required />
              <label>Username</label>
              <i className="fa-solid fa-user"></i>
            </div>

            <div className="field-wrapper slide-element">
              <input type="password" name="password" required />
              <label>Password</label>
              <i className="fa-solid fa-lock"></i>
            </div>

            {loginState.error && (
              <p className="form-error slide-element" role="alert">
                {loginState.error}
              </p>
            )}

            <div className="field-wrapper slide-element">
              <button type="submit" className="submit-button" disabled={loginPending}>
                {loginPending ? 'Signing in...' : 'Login'}
              </button>
            </div>

            <div className="switch-link slide-element">
              <p>Don't have an account? <br />
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsToggled(true);
                  }}
                  className="register-trigger"
                >
                  Sign Up
                </a>
              </p>
            </div>
          </form>
        </div>

        <div className="welcome-section signin">
          <h2 className="slide-element">WELCOME BACK!</h2>
        </div>

        {/* SIGNUP SECTION */}
        <div className="credentials-panel signup">
          <div className="slide-element mb-3 flex items-center justify-start">
            <img src="/logo.png" alt="Legal Success India" className="h-14 w-14 rounded-full object-cover invert brightness-125" />
          </div>
          <h2 className="slide-element">Register</h2>
          <form action={registerFormAction} className="form-stack" noValidate>
            <div className="field-wrapper slide-element">
              <input type="text" name="name" required />
              <label>Full Name</label>
              <i className="fa-solid fa-signature"></i>
            </div>

            <div className="field-wrapper slide-element">
              <input type="text" name="username" required />
              <label>Username</label>
              <i className="fa-solid fa-user"></i>
            </div>

            <div className="field-wrapper slide-element">
              <input type="password" name="password" required />
              <label>Password</label>
              <i className="fa-solid fa-lock"></i>
            </div>

            {registerState.error && (
              <p className="form-error slide-element" role="alert">
                {registerState.error}
              </p>
            )}

            <div className="field-wrapper slide-element">
              <button type="submit" className="submit-button" disabled={registerPending}>
                {registerPending ? 'Registering...' : 'Register'}
              </button>
            </div>

            <div className="switch-link slide-element">
              <p>Already have an account? <br />
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsToggled(false);
                  }}
                  className="login-trigger"
                >
                  Sign In
                </a>
              </p>
            </div>
          </form>
        </div>

        <div className="welcome-section signup">
          <h2 className="slide-element">WELCOME!</h2>
        </div>
      </div>

      <div className="footer">
        <p>Made with ❤️ by <a href="#">KhalidLegalTeam</a></p>
      </div>
    </>
  );
}
