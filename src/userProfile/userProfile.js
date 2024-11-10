import React, { useState, useEffect } from 'react';
import './userProfile.css';
import { useParams, useLocation } from 'react-router-dom';
import Posts from '../post/posts';
import { useNavigate } from 'react-router-dom';
// UserProfile component
const UserProfile = ({ updatedFriendsList }) => {
    // Initialize state variables
    const [DBposts, setDBPosts] = useState([]);
    const [userData, setUserData] = useState({ profilePic: '', coverPic: '', nick: '' });
    const [isFriend, setIsFriend] = useState(false);
    const [checkCompleted, setCheckCompleted] = useState(false);
    const { userId } = useParams();
    const location = useLocation();
    const [isFromFriendRequest, setIsFromFriendRequest] = useState(false);
    const [isMyProfile, setIsMyProfile] = useState(false);
    const [friends, setFriends] = useState([{}]);
    const navigate = useNavigate();
    const [actionTriggered, setActionTriggered] = useState(false);
    // Fetch the user's posts
    useEffect(() => {
        //check if the user is coming from a friend request
        const fromFriendRequest = location.state?.fromFriendRequest;
        setIsFromFriendRequest(!!fromFriendRequest);
        // Scroll to the top of the page
        window.scrollTo(0, 0);
        // Fetch the user's posts
        const fetchPosts = async () => {
            // Reset the posts array
            setDBPosts([]);
            setIsFriend(false);
            setCheckCompleted(false);
            setIsMyProfile(false);
            try {
                // Fetch the user's posts from the backend
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
                // Get the JSON response
                const postsJSON = await response.json();
                if (response.status < 250) {
                    setIsFriend(true);
                }
                // Set the posts array
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
        // Fetch the user's info
        const getUserInfo = async () => {
            try {
                // Fetch the user's info from the backend
                const token = localStorage.getItem('userToken');
                if (!token) {
                    alert('You must be logged in to view this.');
                    return;
                }
                // Fetch the user's info from the backend
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
                // Get the JSON response
                const data = await response.json();
                setUserData({
                    // Set the user's info
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
    }, [location, userId,actionTriggered]);

    // Function to send a friendship request
    const SendFriendship = async () => {
        try {
            // Get the user's token
            const token = localStorage.getItem('userToken');
            if (!token) {
                alert('You must be logged in to send friendship requests.');
                return;
            }
            // Send the friendship request
            const response = await fetch(`http://localhost:12345/api/users/${userId}/friends`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw alert(`Friend request already sent`);
            }
            // Alert the user that the request was sent
            alert('Friendship request sent');
        }
        catch (error) {
            console.error('Error:', error);
        }
    }
    // Function to accept a friendship request
    const acceptRequest = async () => {
        try {
            // Get the user's token and ID from local storage
            const id = localStorage.getItem('userID');
            const token = localStorage.getItem('userToken');
            if (!token || !id) {
                alert('You must be logged in to send friendship requests.');
                return;
            }
            // Send the request to the backend
            const response = await fetch(`http://localhost:12345/api/users/${id}/friends/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            // Alert the user that the request was sent and update the states
            setIsFriend(true);
            setActionTriggered(prevState => !prevState);
            updatedFriendsList();
            
        }

        catch (error) {
            console.error('Error:', error);
            alert('Failed to send friendship request.');
        }
    }
    // Function to delete a friendship request
    const deleteFriend = async () => {
        try {
            // Get the user's token and ID from local storage
            const id = localStorage.getItem('userID');
            const token = localStorage.getItem('userToken');
            if (!token || !id) {
                alert('You must be logged in to send friendship requests.');
                return;
            }
            // Send the request to the backend
            const response = await fetch(`http://localhost:12345/api/users/${id}/friends/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            // Alert the user that the request was sent and update the states
            setIsFriend(false);
            setActionTriggered(prevState => !prevState);
           updatedFriendsList();
        }

        catch (error) {
            console.error('Error:', error);
            alert('Failed to send friendship request.');
        }
    }

    const update = () => {
        // Navigate to the update user page
        navigate(`/updateUser`, { state: { fromProfile: true } });
    }
    // Function to fetch the user's friends list
    const fetchFriends = async () => {
        try {
            const token = localStorage.getItem('userToken');
            if (!token) {
                alert('You must be logged in to view friends.');
                return;
            }
            // Fetch the user's friends list from the backend
            const response = await fetch(`http://localhost:12345/api/users/${userId}/friends`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            // Get the JSON response
            const data = await response.json();
            setFriends(data.friends);
            updatedFriendsList();
        }
        catch (error) {
            console.error('Error fetching friends:', error);
        }
    };

    return (
        <div className="profile">
            <div
                className="cover-photo"
                style={{ backgroundImage: `url(${userData.coverPic})` }}
            ></div>
            <img    
                className="profile-photo"
                src={userData.profilePic}
            ></img>
            <div className="user-name">
                <div className="user-nickname">{userData.nick}</div>
                
            </div>
            <div className='userPosts'>
                {/* Conditionally render the "Send request" button based on posts */}
                {!isFriend && checkCompleted && (
                    !isFromFriendRequest ? (
                        <div >
                            <button id="Follow-btn" className="btn btn-primary" onClick={SendFriendship} type="button">Send friendship</button>
                        </div>)
                        :
                        <div>
                            {/*Render the buttons to accept or delete the request */}
                            <a href="#" id="Follow-btn" class="btn btn-primary" onClick={acceptRequest}>Confirm request <span class="fa fa-check"></span></a>
                            <a href="#" id="Follow-btn" className="btn btn-danger" onClick={deleteFriend}>Delete request <span class="fa fa-close"></span></a>
                        </div>)}
                {/* if its a frined profile render the delete and friend button  */}
                {isFriend && checkCompleted && !isMyProfile ?
                    <><>
                        <button id="Follow-btn" class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight"
                            aria-controls="offcanvasRight" onClick={fetchFriends}>User's friends</button>
                            <button id="Follow-btn" className="btn btn-danger" onClick={deleteFriend}>Delete friend</button>
                            </>
                            {/* Render the offcanvas to show the friends list */}
                            <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
                            <div class="offcanvas-header">
                                <h5 class="offcanvas-title" id="offcanvasRightLabel">User's friends list</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                            </div>
                            <div class="offcanvas-body">
                                {/** Map through the friends list and render the friends */}
                                {friends.length > 0 ? (
                                    friends.map((friend, index) => (
                                        <div key={index} className="friend-item">
                                            <img src={friend.img} alt={friend.nick} className="friend-image" />
                                            <p className="friend-name">{friend.nick}</p>
                                        </div>
                                    ))) : (null)}
                            </div>
                        </div></> :
                    isMyProfile ?
                        <button id="Follow-btn" className="btn btn-primary" onClick={update}>Update user info</button> : null}
                {DBposts.length === 0 && checkCompleted ? null : <Posts posts={DBposts} />}
            </div>

        </div>
    );
};

export default UserProfile;