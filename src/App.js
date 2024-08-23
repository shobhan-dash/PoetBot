import { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

export default function App() {
  const [isUserSignedIn, setUserSignIn] = useState(false);
  document.title = 'PoetBot';

  return (
    isUserSignedIn ? (
      <Dashboard setUserSignIn={setUserSignIn} />
    ) : (
      <Login isUserSignedIn={isUserSignedIn} setUserSignIn={setUserSignIn} />
    )
  );
}
