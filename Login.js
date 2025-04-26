import React from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { app } from './firebase'; // make sure this points to your firebase.js where you initialize your app
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const auth = getAuth(app);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('User Info:', user);
      navigate('/'); // redirect to inbox after successful login
    } catch (error) {
      console.error('Error during sign-in:', error.message);
    }
  };

  return (
    <div className="login" style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
      <button 
        onClick={handleGoogleLogin} 
        className="button is-primary is-large"
      >
        Sign In with Google
      </button>
    </div>
  );
}

export default Login;
