import React from "react";
import { useAuth } from "../utils/authContext";

const Logout = () => {
  const { setUser } = useAuth();

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <button className="logout-button" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default Logout;
