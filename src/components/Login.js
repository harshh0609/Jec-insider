import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../utils/authContext";
import { jwtDecode } from 'jwt-decode'; // Correct import for jwtDecode



const Login = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleSuccess = (response) => {
    const userData = jwtDecode(response.credential); // Decode JWT token
    setUser(userData); // Set user info in global context
    navigate("/Magazine"); // Redirect after successful login
  };

  const handleError = () => {
    alert("Login Failed!");
  };

  return (
    
    <div className="login-container">
      
      <h2 className="login-heading">Welcome! Please Login</h2>
      <div className="google-login-wrapper">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          useOneTap
        />
      </div>
    </div>
  );
};

export default Login;
