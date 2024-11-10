import React, { useEffect, useState } from 'react';
import './friendList.css';
import { useNavigate } from 'react-router-dom';
// This component displays the list of friends and friend requests.
const FriendList = ({ refreshFeed }) => {
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);

  // Fetch friends and friend requests when the component mounts
  useEffect(() => {
    fetchFriends(); 
    fetchRequests();
  }, [refreshFeed]); 
  // Function to fetch friends from the server
  const fetchFriends = async () => {
    try {
      // Retrieve the user ID and token from local storage
      const userId = localStorage.getItem('userID');
      const token = localStorage.getItem('userToken');
      if (!token) {
          alert('You must be logged in to view friends.');
          return;
      }
      // Send a GET request to the server
      const response = await fetch(`http://localhost:12345/api/users/${userId}/friends`, {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${token}`
          }
      });

      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      //set the friends state
      const data = await response.json();
      setFriends(data.friends); 
    }
    catch (error) {
        console.error('Error fetching friends:', error);
    }
  };
  // Function to fetch friend requests from the server
  const fetchRequests = async () => {
    try {
      // Retrieve the token from local storage
      const token = localStorage.getItem('userToken');
      if (!token) {
          alert('You must be logged in to view friends.');
          return;
      }
      // Send a GET request to the server
      const response = await fetch(`http://localhost:12345/api/users/req`, {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${token}`
          }
      });

      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      //set the friendRequests state
      const data = await response.json();
      setFriendRequests(data.friendsRequest); 
    }
    catch (error) {
        console.error('Error fetching friends:', error);
    }
  };

  // Function to handle the click on a friend request
  const handleReqClick = (userId) => {
    //navigate to the profile page of the user that sent the request
    navigate(`/profile/${userId}`, { state: { fromFriendRequest: true } });
  };

  // Function to handle the click on a friend
  const handleFriendClcik = (userId) => {
    //navigate to the profile page of the friend
    navigate(`/profile/${userId}`);
  };
  return (
    // Display the list of friends and friend requests
     <div className="friends-list">
      <h4>Friendship request</h4>
      
      {friendRequests.length > 0 ? (
        //map the friend requests
        friendRequests.map((friend, index) => (
          //display the friend request
          <div key={index} className="friend-item" onClick={() => handleReqClick(friend.id)}>
            <img src={friend.img} alt={friend.nick} className="friend-image" />
            <p className="friend-name">{friend.nick}</p>
          </div>
        ))
      ) : (
        //display a message if there are no friend requests
        <p>No friendship request to show.</p>
      )}
      {/* Display the list of friends */}
      <h4>Friends</h4>
      {friends.length > 0 ? (
        //map the friends
        friends.map((friend, index) => (
          //display the friend
          <div key={index} className="friend-item" onClick={() => handleFriendClcik(friend.id)}>
            <img src={friend.img} alt={friend.nick} className="friend-image" />
            <p className="friend-name">{friend.nick}</p>
          </div>
        ))
      ) : (
        //display a message if there are no friends
        <p>No friends to show.</p>
      )}
    </div>
  );
}

export default FriendList;
