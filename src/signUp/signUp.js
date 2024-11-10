import React, { useState, useContext, useEffect } from "react";
import MakeButton from "./makeButton";
import buttonsData from "./buttons.json";
import "./signUp.css";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from '../themeContext/themeContext';
import { useLocation } from 'react-router-dom';


const SignUp = () => {
  // Accessing theme and toggleTheme from ThemeContext using useContext hook
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isFromProfile, setIsFromProfile] = useState(false);
  useEffect(() => {
    // Check if the user is redirected from the profile page
    const fromProfile = location.state?.fromProfile;
    setIsFromProfile(!!fromProfile);
  }, [location]);

  // Initialize formData state with default values
  const [formData, setFormData] = useState({
    Name: "",
    Password: "",
    ConfirmPassword: "",
    img: null
  });

  // Function to handle input changes
  const handleInputChange = (id, value) => {
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  // Function to handle image selection
  const handleImageChange = (event) => {
    // Check if the file is an image
    const file = event.target.files[0];
    if (file) {

      // Check if the file is an image
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        event.target.value = '';
        return;
      }

      // Update state with the selected image
      setFormData({
        ...formData,
        img: URL.createObjectURL(file)
      });
    }
  };
  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    // Check if the password and confirm password are the same
    if (formData.Password !== formData.ConfirmPassword) {

      alert("Password and Confirm Password must be the same");
      return;
    }
    // Function to read the file as base64
    const readFileAsBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    };
    // Convert the selected image to base64
    let base64Image = "";
    if (document.getElementById('imageInput').files[0]) {
      base64Image = await readFileAsBase64(document.getElementById('imageInput').files[0]);
    } else {
      alert("Please select an image.");
      return;
    }
    // Create user data object
    const userData = {
      username: formData.Name,
      password: formData.Password,
      nick: formData.NickName,
      img: base64Image
    };

    try {
      // Send a POST request to the server to create a new user
      let response;
      let userId;
      // Check if the user is redirected from the profile page
      if (!isFromProfile) {
        response = await fetch('http://localhost:12345/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData)
        });
      } else {
        // Send a PUT request to the server to update the user data
        const token = localStorage.getItem('userToken');
        userId = localStorage.getItem('userID');
        if (!token || !userId) {
          alert('You must be logged in to modify friendship requests.');
          return;
        }
        response = await fetch(`http://localhost:12345/api/users/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          // Send the user data to the server
          body: JSON.stringify(userData)
        });
      }
      // Check if the username already exists
      if (response.status === 409) {
        alert('Username already exists.');
        return;
      }
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      if (!isFromProfile) { navigate('/login') }
      else { navigate(`/profile/${userId}`) };
    } catch (error) {
      // Handle errors
      console.error('Error:', error);
      if(isFromProfile){
        alert('Username is already taken')
      }else{
        alert('Failed to create user.');

      }
    }
  };


  // Render the SignUp component
  return (
    <div>
      {/* Button to toggle between dark and light mode */}
      <button className="Toggle" onClick={toggleTheme}>
        {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
      </button>
      {/* Mapping through button data and rendering MakeButton component */}
      <form className="signin-container" onSubmit={handleSubmit}>
        {buttonsData.map((button) => (
          <MakeButton
            key={button.id}
            id={button.id}
            label1={
              button.name 
            }
            label2={
              button.id === "ConfirmPassword" ?
                `Confirm password` :
                isFromProfile ?
                  `Enter new ${button.label}` :
                  `Enter ${button.label}`
            }
            placeholder={button.id}
            type={button.type}
            value={formData[button.id] || ""}
            handleChange={(e) => handleInputChange(button.id, e.target.value)}
            required
          />
        ))}
        {/* Input field to select an image */}
        <label id="label" htmlFor="imageInput">Select Image:</label>
        <input type="file" id="imageInput" onChange={handleImageChange} />
        {/* Render the selected image if available */}
        {formData.img && <img src={formData.img} alt="Selected" style={{ maxWidth: '50%', maxHeight: '100px' }} />}
        {/* Submit button */}
        <button id="submit" type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SignUp;
