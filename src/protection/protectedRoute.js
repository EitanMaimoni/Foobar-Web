import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import verifyToken from './tokenVerification';
// This component is a wrapper around the Navigate component from react-router-dom. 
//It checks if the user is authenticated before rendering the children components. 
//If the user is not authenticated, it redirects them to the login page. If the user is authenticated,
// it renders the children components.
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  // Check if the user is authenticated
  useEffect(() => {
    console.log("ASDSAD")
    const checkAuth = async () => {
      const isValid = await verifyToken();
      setIsAuthenticated(isValid);
    };
    // Call the checkAuth function when the component mounts
    checkAuth();
  }, []); 
  if (isAuthenticated === null) {
    // If the authentication status is not determined yet, display a loading message
    console.log("asdasdsad")
   return <div>Loading...</div>; 
  }

  // If the user is authenticated, render the children components
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
