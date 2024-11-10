import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './createPost.css';
import Comment from '../comment/comment';
import ShareMenu from './shareMenu';
const CreatePost = ({ postOwnerID, id, username, timestamp, originalContent, likes, comments, image, profile }) => {
  // Initialize state variables
  const navigate = useNavigate();
  const [isRemoved, setIsRemoved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState(originalContent);
  const [currentImage, setCurrentImage] = useState(image);
  const [newImage, setNewImage] = useState(image);
  const [LikeCount, setLikeCount] = useState(likes.length);

  // Function to handle post removal
  const Remove = async () => {
    try {
      // Retrieve the token from local storage
      const token = localStorage.getItem('userToken');
      if (!token) {
        alert('You must be logged in to remove posts.');
        return;
      }
      const userID = localStorage.getItem('userID');
      if (!userID) {
        alert('You must be logged in to remove posts.');
        return;
      }
      // Send the request to the server
      const response = await fetch(`http://localhost:12345/api/users/${userID}/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      // Check if the request was successful
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      // Log the success message
      console.log('Post removed successfully');
      setIsRemoved(true);
    } catch (error) {
      if (error.message === 'Error: 401') {
        alert('You are not authorized to remove this post.');
        return
      }
      console.error('Failed to remove post:', error);
      alert('Failed to remove post.');
    }
  };

  // Function to handle post like
  const handleLike = async () => {
    try {
      // Retrieve the token from local storage
      const token = localStorage.getItem('userToken');
      if (!token) {
        alert('You must be logged in to like posts.');
        return;
      }

      // Send the request to the server
      const response = await fetch(`http://localhost:12345/api/posts/like/${id}`, {
        method: 'PUT', // or 'POST', as per your backend API
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      // Check if the request was successful
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      // get the new like count
      const responseData = await response.json();
      setLikeCount(responseData);

    } catch (error) {
      console.error('Failed to like post:', error);
      alert('Failed to like post.');
    }
  };

  // Function to handle post edit that check if the user is authorized to edit the post
  const handleEdit = async () => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        alert('You must be logged in to like posts.');
        return;
      }
      // Send the request to the server
      const responseAuth = await fetch(`http://localhost:12345/api/posts/edit/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      if (!responseAuth.ok) {
        throw alert(`Error: not authorized`);
      }
      //change the state to editing
      setIsEditing(true);
    } catch (error) {
      console.error('Failed to edit post:', error);
    }
  };

  // Function to handle post changes
  const handleSave = async () => {
    try {
      // Retrieve the token from local storage
      const userId = localStorage.getItem('userID');
      const token = localStorage.getItem('userToken');
      if (!token) {
        alert('You must be logged in to edit posts.');
        return;
      }
      // Send the request to the server
      const postData = {
        content: editableContent,
        image: newImage,
      };
    
      const response = await fetch(`http://localhost:12345/api/users/${userId}/posts/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        // Send the updated post data to the server
        body: JSON.stringify(postData)
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      // Log the success message
      console.log('Post updated successfully:', data);
      setIsEditing(false);
      setCurrentImage(newImage);
    } catch (error) {
      console.error('Failed to edit post:', error);
    }
  };

  // Function to handle input change
  const handleChange = (event) => {
    setEditableContent(event.target.value);
  };

  const handleImage = async (event) => {
// Function to handle image selection
    //convert the image to base64
    const readFileAsBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
      });
    }
    // Convert the selected image to base64
    let base64Image = "";
    const file = event.target.files[0];
    if (file) {
      base64Image = await readFileAsBase64(file);
    }
    // Set the new image
    setNewImage(base64Image);
  };
  
  // this function will navigate to the user profile
  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  if (isRemoved) {
    return null;
  }
  return (
    // Create a post component
    <div className="post">
      <div className="post-header">
        {/** Display user profile picture and post information */}
        <div className="post-header-info">
          <button className="button-with-profilePic" onClick={() => handleUserClick(postOwnerID)}>
            <img src={profile} alt="PostIm" className="profilePic" />
          </button>
          <div className="user-info">
            <button className="username" onClick={() => handleUserClick(postOwnerID)}>{username}</button>
            <p className="timestamp">{timestamp}</p>
          </div>
        </div>
        <div className="post-header-actions">
          {/** Display edit and remove buttons */}
          {isEditing ? (
            // Display save button if editing
            <button id="save" onClick={handleSave}>Save</button>
          ) : (
            // Display edit button if not editing
            <i className="bi bi-pencil-square Edit" onClick={handleEdit}></i>
          )}
          <button className="x-button" onClick={Remove}><i className="bi bi-x-lg"></i></button>
        </div>
      </div>
      {/** Display post content and image */}
      <div className="post-content">
        {isEditing ? (
          <div>
            {/** Display textarea for editing the post content */}
            <textarea value={editableContent} onChange={handleChange} className="edit-textarea" />
            <input type="file" id="imageInput" onChange={handleImage} />
            {newImage && <img src={newImage} alt="New Post" className="post-image" />}
          </div>
        ) : (
          <div>
            {/** Display the post content */}
            <p>{editableContent}</p>
            {currentImage && <img src={currentImage} alt="Post" className="post-image" />}
          </div>
        )}
      </div>

      <div className="buttons">
        {/** Display like, comment, and share buttons */}
        <button className="like-button" onClick={handleLike}>
          <i className="bi bi-hand-thumbs-up"></i>
          &nbsp; Likes: {LikeCount}
        </button>

        {/** Display comment button */}
        <Comment postId={id} comments={comments} className="comment-button" />
        {/** Display share button */}
        <ShareMenu className="share-button" />
      </div>
    </div>
  );
};

export default CreatePost;