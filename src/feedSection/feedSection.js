import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./feedSection.css";
import FeedItem from "./feedItem/feedItem";
import FeedData from "./feedItem/feedItem.json";
//this is the feed section of the app
const FeedSection = ({ currentPage }) => {
  // Use the useNavigate hook to navigate to different pages
  const [selectedIcon, setSelectedIcon] = useState(currentPage);
  const navigate = useNavigate();

  // Function to get the user ID
  const getID = async () => {
    try {
      // Retrieve the token from local storage
      const token = localStorage.getItem('userToken');
      if (!token) {
        alert('You must be logged in to post.');
        return;
      }
      // Send a POST request to the server
      const response = await fetch('http://localhost:12345/api/users/getID', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      // Parse the JSON response
      const data = await response.json();
      //return the user ID
      return data.ownerId

    } catch (error) {
      console.error('Error:', error);
      alert('Failed to create user.');
    }
  }

  // Update the selected icon when the currentPage changes
  useEffect(() => {
    // If the currentPage is 'feed', set the selected icon to the first icon
    if (currentPage === 'feed') {
      setSelectedIcon(FeedData[0]);
    } else if (currentPage === 'profile') {
      setSelectedIcon(FeedData[1]);
    }
  }, [currentPage]);
  // Function to handle the click event
  const handleItemClick = async (iconClass) => {
    // Only update if the clicked icon is different from the current page
    if ((iconClass === FeedData[0] && currentPage !== 'feed') ||
      (iconClass === FeedData[1])) {
      setSelectedIcon(iconClass);
        // Navigate to the feed page
      if (iconClass === FeedData[0]) {
        navigate('/feed');
      } else if (iconClass === FeedData[1]) {
        const id = await getID();
        navigate(`/profile/${id}`, { state: { fromFeedSection: true } });
      }
    }
  };

  return (
    <div className="d-flex align-items-center">
      {FeedData.map((iconClass, index) => (
        <FeedItem
          key={index}
          iconClass={iconClass}
          isClicked={iconClass === selectedIcon}
          handleClick={() => handleItemClick(iconClass)}
        />
      ))}
    </div>
  );
};

export default FeedSection;
