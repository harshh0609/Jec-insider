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
import { Navbar } from "./components/Navbar";
import {AboutUs} from "./components/AboutUs";

const NavLinks = () => {
  const { user } = useAuth();

  return (
    <Navbar />
  );
};

const App = () => {
  return (
    <GoogleOAuthProvider clientId="1084448620949-emt0e0afuqiuteppubjpokaes10afmm6.apps.googleusercontent.com">
      <AuthProvider>
        <Router>
          <NavLinks />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/AboutUs" element={<AboutUs />} />

            {/* No ProtectedRoute here anymore */}
            <Route path="/Magazine" element={<ProtectedPage />} />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
