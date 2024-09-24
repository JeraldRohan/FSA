import React, { useState, useEffect } from 'react';
import './Signin.css';
import signInBackground from './assets/signin.jpg'; // Background image
import boxLogo from './assets/boxlogo.png'; // Logo image

function SignIn({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    document.title = 'Faculty-Logger-SignIn'; // Set the title here
  }, []);

  const handleLogin = (event) => {
    // Prevent form default submission behavior
    event.preventDefault();

    // Convert email to lowercase for case-insensitive comparison
    const normalizedEmail = email.toLowerCase();

    if (normalizedEmail === 'jeraldrohan.cb22@bitsathy.ac.in' && password === '1234') {
      onLogin(true);
      setLoginError('');
    } else {
      setLoginError('Invalid email or password.');
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
        <form onSubmit={handleLogin}>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            required
            autoComplete="off"  
            value={email}
            onChange={(e) => setEmail(e.target.value)}
                    />
          <br/>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
              required
            autoComplete="off"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          
          />
          <br/>
          <button type="submit">Sign In</button>
          {loginError && <p className="error">{loginError}</p>}
        </form>
      </div>
    </div>
  );
}

export default SignIn;
