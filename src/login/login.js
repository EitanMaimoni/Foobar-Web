import React, { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import "./login.css";
import InputBox from "../inputBox/inputBox";
import { ThemeContext } from '../themeContext/themeContext';

const Login = () => {
  // Accessing theme and toggleTheme from ThemeContext using useContext hook
  const { theme, toggleTheme } = useContext(ThemeContext);
  // Use the useNavigate hook to navigate to other pages
  const navigate = useNavigate();
  // Initialize state for username, password, and login message
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");

  const handleSignUpClick = () => {
    // Change this to the path of your signup page
    navigate('/signup');
  };

// Function to handle login button click
  const handleLoginClick = async () => {
    try {
      // Send a POST request to the server
      const response = await fetch('http://localhost:12345/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Send the username and password in the request body
        body: JSON.stringify({ username, password })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      // Parse the JSON response
      const data = await response.json();
      if (data) {
        // Now, get the token from the specified URL
        const tokenResponse = await fetch('http://localhost:12345/api/tokens', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }) 
        });


        if (!tokenResponse.ok) {
          throw new Error(`HTTP error! Status: ${tokenResponse.status}`);
        }
        // Parse the JSON response
        const tokenData = await tokenResponse.json();

        // Store the received token in local storage
        localStorage.setItem('userToken', tokenData.token);
        localStorage.setItem('userID', data.id);

        // Set the login message
        setLoginMessage(`Welcome, ${username}! You have successfully logged in.`);
        // Navigate to the feed page
        navigate('/Feed');
      } else {
        setLoginMessage('Invalid email or password. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setLoginMessage('Login failed. Please try again later.');
    }
  };


  return (
    <div className="Login">
      {/* Use the theme to conditionally render the class */}
      <button className="Toggle" onClick={toggleTheme}>
        {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
      </button>
      <div className="content-box">
        {/* Add the login form */}
        <InputBox param={"username"} value={username} onChange={setUsername} />
        <InputBox param={"password"} value={password} onChange={setPassword} />
        <button type="button" className="btn btn-primary" onClick={handleLoginClick}>
          Login
        </button>
        <button type="button" className="btn btn-success" onClick={handleSignUpClick}>
          Sign Up
        </button>
        <div>
          {/* Display login message */}
          {loginMessage && <p>{loginMessage}</p>}
        </div>
      </div>

      <div id="textContainerf">
        {/* Add the facebook logo */}
        <p>facebook</p>
      </div>
      <div id="textContainer">
        <p>Connect with friends and the world around you on Facebook.</p>
      </div>

    </div>
  );
};


export default Login;
