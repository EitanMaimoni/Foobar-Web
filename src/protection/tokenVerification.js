// This function verifies the token stored in local storage by sending it to the server for verification.
const verifyToken = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      return false;
    }
    // Send a POST request to the server to verify the token
    try {
      const response = await fetch('http://localhost:12345/api/tokens/verifyToken', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      // Check if the token is valid
      if (response.ok) {
        const data = await response.json();
        return data.isValid;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      return false;
    }
  }
  
  export default verifyToken;
  