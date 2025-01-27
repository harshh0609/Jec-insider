import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useAuth } from '../utils/authContext'; // Import useAuth
import { Link } from "react-router-dom";
import { CNavbar, CNavbarNav, CNavItem, CNavLink, CNavbarToggler, CCollapse, CContainer } from '@coreui/react';

export const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const { user, setUser } = useAuth(); // Access user from the auth context
  const navigate = useNavigate(); // Hook to navigate programmatically

  // Handle logout function and redirect
  const handleLogout = (e) => {
    e.preventDefault(); // Prevent default link behavior
    setUser(null); // Clear user from context
    localStorage.removeItem("authToken"); // Remove token from localStorage
    localStorage.removeItem("userRole"); // Remove role if applicable
    navigate('/'); // Redirect to home page
  };

  return (
    <CNavbar expand="lg" className="bg-body-tertiary">
      <CContainer fluid>
        <CNavbarToggler
          aria-label="Toggle navigation"
          aria-expanded={visible}
          onClick={() => setVisible(!visible)}
        />
        <CCollapse className="navbar-collapse" visible={visible}>
          <CNavbarNav>
            <CNavItem>
              <CNavLink href="/" active>
                Home
              </CNavLink>
            </CNavItem>
            <CNavItem>
          <Link to="/Magazine" className="nav-link">Magazine</Link>
            </CNavItem>
          <CNavItem>
          <Link to="/AboutUs" className="nav-link">About-us</Link>
          </CNavItem>
            {/* Conditionally render Logout only when user is logged in */}
            {user && (
              <CNavItem>
                <CNavLink href="#" onClick={handleLogout}>
                  Logout
                </CNavLink>
              </CNavItem>
            )}
          </CNavbarNav>
        </CCollapse>
      </CContainer>
    </CNavbar>
  );
};
