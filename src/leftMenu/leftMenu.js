import React from "react";
import MakeLeftList from "./makeLeftList";
import './leftMenu.css';

//this function creates the left menu
const LeftMenu = () => {
    return (
        // Add the left menu to the left menu container
        <div className="left-menu-container">
            <ul className="list-group">
                <MakeLeftList />
            </ul>
        </div>
    );
};

export default LeftMenu;