import React, { useState } from 'react';
import { auth, provider } from './auth/firebase-config';
import { signInWithPopup } from 'firebase/auth';
import GoogleLogo from '../assets/images/google.svg';
import PoetBotLogo from '../assets/images/poetbot-logo.png';
import Dashboard from './Dashboard';
import CircularProgress from '@mui/material/CircularProgress'; 

function Login({ isUserSignedIn, setUserSignIn, setUserData }) {
  const [loading, setLoading] = useState(false); // State to manage loading upon user click

  const signInWithGoogle = () => {
    setLoading(true); // Set loading to true when login starts
    signInWithPopup(auth, provider)
      .then((result) => {
        // console.log("Sign in successful: ", result.user);
        setUserData(result);
        setUserSignIn(true);
      })
      .catch((error) => {
        console.error("Error during sign in: ", error);
      })
      .finally(() => {
        setLoading(false); // Set loading to false once the process is finished
      });
  };

  return (
    isUserSignedIn ? <Dashboard setUserSignIn={setUserSignIn} /> :
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="text-center">
          <img
            src={PoetBotLogo}
            alt="PoetBot logo"
            className="w-32 h-32 mx-auto mb-4 rounded-full shadow-lg"
          />
          <h1 className="text-4xl font-bold mb-4">Welcome to PoetBot</h1>
          <p className="text-xl mb-8">Your AI powered Poetry assistant</p>
          <button
            onClick={signInWithGoogle}
            className="flex items-center justify-center px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 mx-auto"
          >
            {loading ? (
              <CircularProgress size={24} className="mr-2" /> // Display loading spinner
            ) : (
              <img
                src={GoogleLogo}
                alt="Google logo"
                className="w-6 h-6 mr-2"
              />
            )}
            Sign in with Google
          </button>
        </div>
      </div>
  );
}

export default Login;
