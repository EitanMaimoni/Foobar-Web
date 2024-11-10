import React, { useState, useRef } from 'react'
import CommentsCreate from './commentsCreate';
import './comment.css';

// This component displays the comments for a post
const Comment = ({ comments, postId }) => {

    // Initialize state variables
    const [isAdded, setIsAdded] = useState(false);
    const input = useRef(null);
    const modalId = `commentsModal-${postId}`;
    const [newComments, setNewComments] = useState(comments);

    // Function to delete a comment
    const deleteComment = async (commentId) => {
        try {
            // Retrieve the token from local storage
            const token = localStorage.getItem('userToken');
            if (!token) {
                alert('You must be logged in to delete comments.');
                return;
            }
            // Send a DELETE request to the server
            const response = await fetch(`http://localhost:12345/api/posts/comment/${postId}/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            console.log('Comment deleted successfully');
            // Refresh the comments list after deleting a comment
            const updatedComments = await response.json(); 
            setNewComments(updatedComments); 
        } catch (error) {
            console.error('Failed to delete comment:', error);
            alert('You are not authorized.');
        }
    };
    // Function to add a comment
    const Add = () => {
        setIsAdded(true);
    }
    // Function to add a comment
    const AddComment = async () => {
        try {
            // Retrieve the token from local storage
            const token = localStorage.getItem('userToken');
            if (!token) {
                alert('You must be logged in to add comments.');
                return;
            }
            // Send a POST request to the server
            const commentContent = input.current.value;
            const response = await fetch(`http://localhost:12345/api/posts/comment/${postId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                // Send the comment data to the server
                body: JSON.stringify({ content: commentContent })
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            // get the new comments
            const updatedComments = await response.json();
            console.log("updatedComments", updatedComments);
            // Update the comments list after adding a comment
            setNewComments(updatedComments); 
            // Reset the input field and state variable
            input.current.value = '';
            setIsAdded(false);
        } catch (error) {
            console.error('Failed to add comment:', error);
            alert('Failed to add comment.');
        }
    };

    // Function to check if the user is authorized to edit a comment
    const handleEditComment = async (id) => {
        try {
            // Retrieve the token from local storage
            const token = localStorage.getItem('userToken');
            if (!token) {
                alert('You must be logged in to edit comments.');
                return false;
            }
            // Send a GET request to the server
            const responseAuth = await fetch(`http://localhost:12345/api/posts/comment/edit/${postId}/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (!responseAuth.ok) {
                // If the response is not OK, it means there's either an authorization error or another issue.
                console.error(`Error: ${responseAuth.statusText}`);
                alert('You are not authorized or there was an error.');
                return false;
            }
            // Parse the JSON response
            const data = await responseAuth.json();
            return data;
        } catch (error) {
            console.error('Failed to check authorization:', error);
            return false;
        }
    };
    // Function to handle post save
    const handleSaveComment = async (id, newContent) => {
        try {
            const token = localStorage.getItem('userToken');
            // Check if both content and image are empty
            if (!token) {
                alert('You must be logged in to edit comments.');
                return false;
            }
            // Send a PATCH request to the server
            const response = await fetch(`http://localhost:12345/api/posts/comment/edit/${postId}/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                // Send the updated comment data to the server
                body: JSON.stringify({ content: newContent }),

            });
            // Check if the request was successful
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            //get the new comments
            const data = await response.json();
        }
        catch (error) {
            console.error('Failed to edit post:', error);
        }
    };

    // Function to format the date in the comments list
    const formatDate = (isoDateString) => {
        const date = new Date(isoDateString);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
        const year = date.getFullYear();
        return `${hours}:${minutes} ${day}/${month}/${year}`;
    };
    
    return (
        <div>
            <button className="commentButton" id="commentbutton" data-bs-toggle="modal" data-bs-target={`#${modalId}`}>
                <i className="bi bi-chat"></i>
                &nbsp; Comments: {newComments.length}
            </button>
            <div className="modal fade" id={modalId} tabIndex="-1" aria-labelledby={`${modalId}Label`} aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id={`${modalId}Label`}>Comments List</h1>
                            <button type="button" className="btn-close CloseEditMode" data-bs-dismiss="modal"
                                aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {newComments.map((comment) => (
                                //map through the comments and create a new CommentsCreate component for each comment
                                <CommentsCreate                               
                                    key={comment._id}
                                    postId={postId}
                                    id={comment._id}
                                    username={comment.nickname}
                                    profile = {comment.profilePic}
                                    likes = {comment.likes}
                                    content={comment.content}
                                    timestamp={formatDate(comment.date)}
                                    deleteComment={deleteComment}
                                    handleEditComment={handleEditComment}
                                    handleSaveComment={handleSaveComment}
                                />
                            ))}
                            <div className="modal-footer">
                                {isAdded ? (
                                    //if the user is adding a comment, show the input and send button
                                    <>
                                        <input ref={input} className="input" placeholder="add a comment..." />
                                        <button type="button" className="btn btn-primary" onClick={AddComment} >Send</button>
                                    </>
                                ) : (
                                    //if the user is not adding a comment, show the close and add comment button
                                    <>
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        <button type="button" className="addComment btn btn-primary" onClick={Add}>Add comment</button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Comment;
