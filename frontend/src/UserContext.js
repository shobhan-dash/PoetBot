import React, { createContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [isUserSignedIn, setUserSignIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserSignIn(true);
        setUserData({
          displayName: user.displayName,
          photoURL: user.photoURL,
        });
      } else {
        setUserSignIn(false);
        setUserData(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ isUserSignedIn, setUserSignIn, userData, setUserData, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};
