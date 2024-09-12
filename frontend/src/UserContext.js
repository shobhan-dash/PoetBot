import React, { createContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// Create a context
export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [isUserSignedIn, setUserSignIn] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setUserData({
          displayName: user.displayName,
          photoURL: user.photoURL,
        });
        setUserSignIn(true);
      } else {
        // User is signed out
        setUserSignIn(false);
        setUserData(null);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ isUserSignedIn, setUserSignIn, userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};
