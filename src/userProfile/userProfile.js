import React, { useState, useEffect } from 'react';
import './userProfile.css';
import { useParams, useLocation } from 'react-router-dom';
import Posts from '../post/posts';

const UserProfile = () => {
    const [DBposts, setDBPosts] = useState([]);
    const [userData, setUserData] = useState({ profilePic: '', coverPic: '', nick: '' });
    const [isFriend, setIsFriend] = useState(false);
    const [checkCompleted, setCheckCompleted] = useState(false);
    const { userId } = useParams();
    const location = useLocation();
    const [isFromFriendRequest, setIsFromFriendRequest] = useState(false);
    const [isMyProfile, setIsMyProfile] = useState(false);


    useEffect(() => {
        const fromFriendRequest = location.state?.fromFriendRequest;
        setIsFromFriendRequest(!!fromFriendRequest);

        window.scrollTo(0, 0);
        const fetchPosts = async () => {
            setDBPosts([]);
            setIsFriend(false);
            setCheckCompleted(false);
            setIsMyProfile(false);
            try {
                const token = localStorage.getItem('userToken');
                if (!token) {
                    alert('You must be logged in to view this.');
                    return;
                }
                const response = await fetch(`http://localhost:12345/api/users/${userId}/posts`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const postsJSON = await response.json();
                console.log(postsJSON)

                if (response.status < 250) {
                    setIsFriend(true);
                }
                setDBPosts(postsJSON.posts);
                if (userId === localStorage.getItem('userID')) {
                    setIsMyProfile(true);
                }
            } catch (error) {
                console.error('There has been a problem with your fetch operation:', error);
            }
            setCheckCompleted(true);
        };
        fetchPosts();

        const getUserInfo = async () => {
            try {
                const token = localStorage.getItem('userToken');
                if (!token) {
                    alert('You must be logged in to view this.');
                    return;
                }
                const response = await fetch(`http://localhost:12345/api/users/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setUserData({
                    profilePic: data.img,
                    coverPic: data.coverImg,
                    nick: data.nick
                });
            } catch (error) {
                console.error('Error:', error);
                alert('Failed to load user info.');
            }

        };
        getUserInfo();
    }, [location, userId]);


    const SendFriendship = async () => {
        try {
            const token = localStorage.getItem('userToken');
            if (!token) {
                alert('You must be logged in to send friendship requests.');
                return;
            }
            const response = await fetch(`http://localhost:12345/api/users/${userId}/friends`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            alert('Friendship request sent');
        }
        catch (error) {
            console.error('Error:', error);
            alert('Failed to send friendship request.');
        }
    }
    const acceptRequest = async () => {
        try {
            const id = localStorage.getItem('userID');
            const token = localStorage.getItem('userToken');
            if (!token || !id) {
                alert('You must be logged in to send friendship requests.');
                return;
            }
            const response = await fetch(`http://localhost:12345/api/users/${id}/friends/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            setIsFriend(true);
        }

        catch (error) {
            console.error('Error:', error);
            alert('Failed to send friendship request.');
        }
    }
    const deleteFriend = async () => {
        try {
            const id = localStorage.getItem('userID');
            const token = localStorage.getItem('userToken');
            if (!token || !id) {
                alert('You must be logged in to send friendship requests.');
                return;
            }
            const response = await fetch(`http://localhost:12345/api/users/${id}/friends/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            setIsFriend(true);
        }

        catch (error) {
            console.error('Error:', error);
            alert('Failed to send friendship request.');
        }
    }
    const denyRequest = async () => {
        try {
            const token = localStorage.getItem('userToken');
            if (!token) {
                alert('You must be logged in to modify friendship requests.');
                return;
            }
            const response = await fetch(`http://localhost:12345/api/users/${userId}/friends`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            alert('Friendship request denied.');
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to deny friendship request.');
        }
    }
    
    
    return (
        <div className="profile">
            <div
                className="cover-photo"
                style={{ backgroundImage: `url(${userData.coverPic})` }}
            ></div>
            <div
                className="profile-photo"
                style={{ backgroundImage: `url(${userData.profilePic})` }}
            ></div>
            <div className="user-name">
                <div className="user-nickname">{userData.nick}</div>
                {/* Conditionally render the "Send request" button based on posts */}
                {!isFriend && checkCompleted && (
                    !isFromFriendRequest ? (
                        <div className="d-grid gap-2 col-6 mx-auto">
                            <button id="Follow-btn" className="btn btn-primary" onClick={SendFriendship} type="button">Send request</button>
                        </div>)
                        :
                        <div>
                            <a href="#" class="accept" onClick={acceptRequest}>ACCEPT <span class="fa fa-check"></span></a>
                            <a href="#" class="deny" onClick={denyRequest}>DENY <span class="fa fa-close"></span></a></div>)}
            </div>
            <div className='userPosts'>
                {isFriend && checkCompleted && !isMyProfile ? <button id="Follow-btn" className="btn btn-danger" onClick={deleteFriend}>delete</button> : null}
                {DBposts.length === 0 && checkCompleted ? null : <Posts posts={DBposts} />}
            </div>

        </div>
    );
};

export default UserProfile;