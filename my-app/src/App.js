import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider, useAuth } from "./utils/authContext";
import Login from "./components/Login";
import Logout from "./components/Logout";
import ProtectedPage from "./components/ProtectedPage";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  console.log("what is here i am getting " + user);
  return user ? children : <Navigate to="/" />;
};

const NavLinks = () => {
  const { user } = useAuth();

  return (
    <nav>
      {user ? (
        <>
          <a href="/protected">Protected Page</a>
        </>
      ) : (
        <a href="/">Login</a>
      )}
    </nav>
  );
};

const App = () => {
  return (
    <GoogleOAuthProvider clientId="149524377700-r3rbiavbpr9ols4r2aho0tk10389u85p.apps.googleusercontent.com">
      <AuthProvider>
        <Router>
          <NavLinks />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route
              path="/protected"
              element={
                <ProtectedRoute>
                  <ProtectedPage />
                  <Logout />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export default App;