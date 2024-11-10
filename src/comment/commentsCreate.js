import React, { useState, useRef, useEffect } from 'react';
import './commentCreate.css';

//this component is used to create a comment
const CommentsCreate = ({ postId, id, username, profile, likes, timestamp, content, deleteComment, handleEditComment,
    handleSaveComment }) => {
    // Initialize state variables
    const [isEditing, setIsEditing] = useState(false);
    const [editableContent, setEditableContent] = useState(content);
    const [likeActive, setLikeActive] = useState(false);
    const textareaRef = useRef(null);
    const amount = likes ? likes.length : 0;
    const [LikeCount, setLikeCount] = useState(amount);

    useEffect(() => {
        // Check if the user has liked the comment
        if (likes) {
            // Retrieve the user ID from local storage
            const user = localStorage.getItem('userID');
            const userLike = likes.find((like) => like == user);
            // Set the likeActive state variable based on the user's like status
            if (userLike) {
                setLikeActive(true);
            } else {
                setLikeActive(false);
            }
        }
    }, [likes]);

    // Function to handle the like button
    const handleLikeComment = async () => {
        try {
            // Retrieve the token from local storage
            const token = localStorage.getItem('userToken');
            if (!token) {
                alert('You must be logged in to like comments.');
                return;
            }
            // Send a PUT request to the server
            const response = await fetch(`http://localhost:12345/api/posts/comment/like/${postId}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            // Parse the JSON response
            const data = await response.json();
            const user = localStorage.getItem('userID');
            // Check if the user has liked the comment
            const userLike = data.find((like) => like == user);
            // Set the likeActive state variable based on the user's like status
            if (userLike) {
                setLikeActive(true);
            } else {
                setLikeActive(false);
            }

            setLikeCount(data.length);
        } catch (error) {
            console.error('Failed to like comment:', error);
            alert('Failed to like comment.');
        }
    }

    // Function to handle the edit button
    const handleEdit = async () => {
        // Check if the user is authorized to edit the comment
        const canEdit = await handleEditComment(id);
        // If the user is authorized, set the isEditing state variable to true
        if (canEdit) {
            setIsEditing(true);
        }
    };
    // Function to handle the save button
    const handleSave = () => {
        // Check if the textarea input is available
        if (textareaRef.current) {
            // Call the handleSaveComment function and pass the comment
            handleSaveComment(id, textareaRef.current.value);
            // Set the isEditing state variable to false
            setIsEditing(false);
        }
    };

    // Function to handle the change event
    const handleChange = (event) => {
        setEditableContent(event.target.value);
    };
    // Function to remove a comment
    const Remove = () => {
        // Call the deleteComment function and pass the comment ID
        deleteComment(id);
    };

    return (
        // Add the comment to the container
        <div className='container'>
            <div className="post-header">
                {/** Add the user's profile picture and the time stamp to the post header */}
                <div className="post-header-info">
                    <img src={profile} alt="PostIm" className="profilePic" />
                    <div className="user-info">
                        <p className="username">{username}</p>
                        <p className="timestamp">{timestamp}</p>
                    </div>
                </div>
                {/** Add the post header actions */}
                <div className="post-header-actions">
                    {isEditing ? (
                        //if the user is editing the comment, show the save button
                        <button onClick={handleSave}>Save</button>
                    ) : (
                        //if the user is not editing the comment, show the edit button
                        <i className="bi bi-pencil-square Edit" onClick={handleEdit}></i>
                    )}
                    <button className="x-button" onClick={Remove}><i className="bi bi-x-lg"></i></button>
                </div>
            </div>
            {/** Add the post content */}
            <div className="modal-body">
                <div className="post-content">
                    {isEditing ? (
                        //if the user is editing the comment, show the textarea
                        <textarea ref={textareaRef} value={editableContent} onChange={handleChange} className="edit-textarea" />
                    ) : (
                        //if the user is not editing the comment, show the content
                        <p>{editableContent}</p>
                    )}
                </div>
            </div>
            <div className="comment-footer">
                {/** Add the like button */}
                <button onClick={handleLikeComment} className={`comments-like ${likeActive ? 'active' : ''}`}>
                    <i className="bi bi-hand-thumbs-up"> </i>
                    <label>{LikeCount}</label>
                </button>
            </div>
        </div>
    );
};
export default CommentsCreate;
