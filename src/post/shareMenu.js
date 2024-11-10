import React from 'react';
import './share.css';
const ShareMenu = () => {
    // Return the share menu
    return(
        // Add the share menu to the post box
    <div className="btn-group">
        {/* Add the share button */}
        <button id="share" className="dropdown-toggle" data-bs-toggle="dropdown" >
        <i className="bi bi-send"></i>
            &nbsp; Share
        </button>
        {/* Add the share menu */}
        <ul className="dropdown-menu dropdown-menu-bottom">
            <li><a className="dropdown-item" href="#">share as post</a></li>
            <li><a className="dropdown-item" href="#">share to whatsApp</a></li>
            <li><a className="dropdown-item" href="#">Share to youre friends</a></li>
            <li><hr className="dropdown-divider"></hr></li>
            <li><a className="dropdown-item" href="#">add youre thoughts:
            </a></li>
        </ul>
    </div>
    );
};
export default ShareMenu;