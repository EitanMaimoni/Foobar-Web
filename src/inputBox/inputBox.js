function InputBox({ param, value, onChange }) {
    // Return the input box
    return (
        <div className="login-container">
            {/* Add the input box to the login container */}
            <label htmlFor={param}>{param}:</label>
            <input
                // Add the input box attributes
                type={param === 'password' ? 'password' : 'text'}
                id={param}
                name={param}
                placeholder={`Enter your ${param}`}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}
export default InputBox;