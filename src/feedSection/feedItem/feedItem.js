import React from "react";

// This function creates the feed item
const FeedItem = ({ iconClass, isClicked, handleClick }) => {
  return (
    // Add the feed item to the feed section 
    <button
      className={`bar feed-item-button ${isClicked ? "clicked" : ""}`}
      onClick={handleClick}
    >
      <i className={`bi ${iconClass} feed-item-icon ${isClicked ? "clicked" : ""}`}></i>
    </button>
  );
};

export default FeedItem;
