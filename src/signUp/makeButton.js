import React from "react";
// this functiion creates the input fields for the form
const MakeButton = ({ id, label1, label2, type, value, handleChange }) => {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label1}</label>
      <input
        type={type} 
        id={id}
        value={value}
        onChange={handleChange}
        placeholder={`${label2}`}
        required
      />
    </div>
  );
};

export default MakeButton;
