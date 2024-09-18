import React, { useState } from 'react';
import './Signin.css';
import signInBackground from './assets/signin.jpg'; // Background image
import boxLogo from './assets/boxlogo.png'; // Logo image
import { auth, provider, signInWithPopup } from './firebase'; // Import Firebase functions

function SignIn({ onLogin }) {
  const [loginError, setLoginError] = useState('');

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("User Info:", result.user);
      onLogin(true); // Call the onLogin callback to indicate successful login
      setLoginError('');
    } catch (error) {
      console.error("Error Code:", error.code);
      console.error("Error Message:", error.message);
      setLoginError("Failed to sign in with Google.");
    }
  };

  return (
    <div
      className="login-page"
      style={{
        backgroundImage: `url(${signInBackground})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div className="login-container">
        <img src={boxLogo} alt="Logo" className="box-logo" />
        <h2>Sign In</h2>
        <button className="google-signin-button" onClick={handleGoogleLogin}>
          Sign in with Google
        </button>
        {loginError && <p className="error">{loginError}</p>}
      </div>
    </div>
  );
}

export default SignIn;