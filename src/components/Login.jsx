import React from 'react';
import { auth, provider } from './auth/firebase-config';
import { signInWithPopup } from 'firebase/auth';
import GoogleLogo from '../assets/images/google.svg';
import Dashboard from './Dashboard';

function Login({isUserSignedIn, setUserSignIn}) {

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        setUserSignIn(true);
      })
      .catch((error) => {
        console.error("Error during sign in: ", error);
      });
  };

  return (
    isUserSignedIn ? <Dashboard setUserSignIn = {setUserSignIn}/> :
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to PoetBot</h1>
        <p className="text-xl mb-8">AI powered Real-time AI Poetry Generation with Emotion Visualization</p>
        <button
          onClick={signInWithGoogle}
          className="flex items-center px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200"
        >
          <img 
            src={GoogleLogo} 
            alt="Google logo" 
            className="w-6 h-6 mr-2"
          />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

export default Login;
