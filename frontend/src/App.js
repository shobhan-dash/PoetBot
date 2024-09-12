import React, { useContext } from 'react';
import { UserContext, UserProvider } from './UserContext';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';

function App() {
  const { isUserSignedIn, isLoading } = useContext(UserContext);

  // Show a loading indicator while determining auth state
  if (isLoading) {
    return <div className='bg-gray-900'></div>;
  }

  return isUserSignedIn ? <Dashboard /> : <LandingPage />;
}

export default function WrappedApp() {
  return (
    <UserProvider>
      <App />
    </UserProvider>
  );
}
