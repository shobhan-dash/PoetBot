import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from './auth/firebase-config';

function Dashboard({ setUserSignIn }) {

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUserSignIn(false);
      })
      .catch((error) => {
        console.error("Error during sign out: ", error);
      });
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-800"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
