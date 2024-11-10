// MakeLeftList.js
import React from 'react';
import members from './leftListMembers.json';
import './makeLeftList.css';

const MakeLeftList = () => {

    // Taost for the comments
    const showToast = (message) => {
        alert(message);
    };
    
    return (
        <ul className="list-group">
            {members.map((member, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between align-items-center" onClick={() => showToast(member.message)}>
                    {member.id}
                    <i className={`bi bi-${member.icon}`}></i>
                </li>
            ))}
        </ul>
    );
};

export default MakeLeftList;
