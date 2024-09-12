import React, { useContext } from "react";
import { UserContext } from "../UserContext";
import Dashboard from "./Dashboard";
import Login from "./Login";

function LandingPage() {
  const { isUserSignedIn } = useContext(UserContext);

  return isUserSignedIn ? <Dashboard /> : <Login />;
}

export default LandingPage;
