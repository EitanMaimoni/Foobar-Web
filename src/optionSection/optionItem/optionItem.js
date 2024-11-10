import React from "react";

const OptionItem = ({ iconClass, onLogout, deleteUser}) => {
    const isLogoutOption = iconClass === "bi-box-arrow-right";
    // If the iconClass is "bi-box-arrow-right", render the logout dropdown button
    return (
        <div>
            {isLogoutOption ? (
                <div className="btn-group dropstart">
                    <button type="button" id ="logOutBtn" className="btn btn-danger dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                    </button>
                    <ul className="dropdown-menu">
                        <li><a className="dropdown-item" href="#" onClick={onLogout}>Logout</a></li>
                        <li><a className="dropdown-item" href="#" onClick={deleteUser} >Delete user</a></li>
                    </ul>
                </div>
            ) : (
                <button className="option-section-button">
                    <div className="circular-container">
                        <i className={`bi ${iconClass}`}></i>
                    </div>
                </button>
            )}
        </div>
    );
};

export default OptionItem;
