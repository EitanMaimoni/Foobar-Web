import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import CreatePost from './createPost';

const Posts = ({ posts }) => {
    const [postsWithProfile, setPostsWithProfile] = useState([]);

    useEffect(() => {
        setPostsWithProfile(posts);
    }, [posts]);
    

    // Use 'postsWithProfile' for sorted and mapped posts to include fetched profiles
    const sortedPosts = postsWithProfile.slice().sort((a, b) => new Date(b.date) - new Date(a.date));

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
        <div className="posts">
            {sortedPosts.map((post) => (
                <CreatePost
                    key={post._id}
                    id={post._id}
                    postOwnerID={post.postOwnerID}
                    username={post.nick}
                    timestamp={formatDate(post.date)}
                    originalContent={post.content}
                    likes={post.likesID}
                    comments={post.comments}
                    image={post.img}
                    profile={post.profilePic} // Profile image from fetched data
                />
            ))}
        </div>
    );
};

export default Posts;
