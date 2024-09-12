import React, { useContext } from 'react';
import { UserContext, UserProvider } from './UserContext';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';

function App() {
  const { isUserSignedIn } = useContext(UserContext); // Access context after wrapping

  return isUserSignedIn ? <Dashboard /> : <LandingPage />;
}

export default function WrappedApp() {
  return (
    <UserProvider>
      <App />
    </UserProvider>
  );
}
