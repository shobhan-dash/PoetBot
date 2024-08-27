import { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

export default function App() {
  const [isUserSignedIn, setUserSignIn] = useState(false);
  const [userData, setUserData] = useState(null);
  document.title = 'PoetBot';

  return (
    isUserSignedIn ? (
      <Dashboard setUserSignIn={setUserSignIn} userData = {userData}/>
    ) : (
      <Login isUserSignedIn={isUserSignedIn} setUserSignIn={setUserSignIn} setUserData = {setUserData} />
    )
  );
}
