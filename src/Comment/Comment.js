import React, { useState } from 'react'
import CommentsCreate from './CommentsCreate';
import { useRef } from 'react';
import User from '../signUp/user';
const Comment = ({ comments, postId }) => {

    const user =User.allUsers[0];
    let username;
    {user == null ? username = "User": username = user.getName()}


    const [isAdded, setIsAdded] = useState(false);
    const input = useRef(null);

    const modalId = `commentsModal-${postId}`;

    const [newComments, setNewComments] = useState(comments);

    const deleteComment = (id) => {
        const updatedComments = newComments.filter((comment) => comment.id !== id);
        setNewComments(updatedComments);
    }
    const Add = () => {
        setIsAdded(true);
    }
    const AddComment = () => {
        const comment = {
            id: newComments.length + 1,
            username: username,
            timestamp: "Just now",
            content: input.current.value
        };
        setNewComments([...newComments, comment]);
        input.current.value = "";
        setIsAdded(false);
    }
    return (
        <div>
            <button className="button" data-bs-toggle="modal" data-bs-target={`#${modalId}`}>
                <i className="bi bi-chat"></i>
                &nbsp; Comments: {newComments.length}
            </button>

            <div className="modal fade" id={modalId} tabIndex="-1" aria-labelledby={`${modalId}Label`} aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id={`${modalId}Label`}>Comments List</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {newComments.map((comment) => (
                                <CommentsCreate
                                    key={comment.id}
                                    id={comment.id}
                                    username={comment.username}
                                    timestamp={comment.timestamp}
                                    content={comment.content}
                                    deleteComment={deleteComment}
                                />
                            ))}
                            <div className="modal-footer">
                                {isAdded ? (
                                    <>
                                        <input ref={input} className="input" placeholder="What's on your mind?" />
                                        <button type="button" className="btn btn-primary" onClick={AddComment} >Send</button>
                                    </>
                                ) : (
                                    <>
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        <button type="button" className="btn btn-primary" onClick={Add}>Add comment</button>
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
