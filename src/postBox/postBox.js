import React from 'react';
import { useState, useEffect } from 'react';
import './postBox.css';
const PostBox = ({ onRefreshFeed }) => {

    // Initialize state for post content and image
    const [postContent, setPostContent] = useState("");
    const [image, setImage] = useState(null);
    const [userProfilePic, setUserProfilePic] = useState("");

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('userToken');
                if (!token) {
                    alert('You must be logged in to post.');
                    return;
                }

                const userId = localStorage.getItem('userID');
                if (!token) {
                    alert('FATAL ERORR!!!! TURN OFF YOU WIFI AND COMPUTER IMMEDIATELY!!!!!!!!!!');
                    return;
                }


                // Fetching user profile
                const response = await fetch(`http://localhost:12345/api/users/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user profile');
                }

                const userData = await response.json();
                setUserProfilePic(userData.img); // Assuming 'img' is the key for the user's profile picture
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        fetchUserProfile();
    }, []);


    // Function to handle input change
    const handleInputChange = (event) => {
        setPostContent(event.target.value);
    };

    // Function to handle image selection
    const handleImageChange = (event) => {
        // Check if the file is an image
        // Update state with the selected image
        const file = event.target.files[0];
        if (file) {
            // Only proceed if a file is selected
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            // Optionally, handle the case where no file is selected
            setImage(null);
        }
    };

    // Function to handle adding a new post
    const handleAddPost = async () => {
        try {
            // Check if both content and image are empty
            if (!postContent.trim() && !image) {
                alert('Please add at least some content or an image.');
                return;
            }

            // Retrieve the token from local storage
            const token = localStorage.getItem('userToken');
            if (!token) {
                alert('You must be logged in to post.');
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
            }
            // Create a new post object
            const postData = {
                content: postContent,
                img: base64Image, 
                date: new Date().toISOString(),
                comments: [],
                likes: []
            };
            // Send a POST request to the server to add the new post
            const userId = localStorage.getItem('userID');
            if (!userId) {
                alert('FATAL ERORR!!!! TURN OFF YOU WIFI AND COMPUTER IMMEDIATELY!!!!!!!!!!');
                return;
            }
            const response = await fetch(`http://localhost:12345/api/users/${userId}/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                // Send the post data to the server
                body: JSON.stringify(postData)
            });
            if (!response.ok) {
                throw new Error('Failed to add post');
            }
            // Refresh the feed
            onRefreshFeed();

            // Reset state
            setPostContent("");
            setImage(null);
            document.getElementById('imageInput').value = "";

        } catch (error) {
            console.error('Error adding post:', error);
            alert('Failed to add post.');
        }
    };


    return (
        <div className="postBox">
            {/* Display user profile picture and input field */}
            <div className="postBox_top">
                {/** Display user profile picture */}
                <img src={userProfilePic} alt="profile" className="profilePic" />
                {/** Display input field */}
                <input type="text" value={postContent} onChange={handleInputChange}
                    placeholder="What's on your mind?" className="postInput" />
            </div>
            {/** Display buttons */}
            <div className="postBox_buttons">
                <button className="postButton" onClick={handleAddPost}>Post</button>
                <label className="postButton">
                    <input type="file" accept="image/*" id="imageInput" onChange={handleImageChange} style={{ display: 'none' }} />
                    Add Image
                </label>
                <button className="postButton">Feeling/Activity</button>
            </div>
            {/** Display selected image */}
            {image && <img src={image} alt="selected" className="selectedImage" />}
        </div>
    );
}

export default PostBox;