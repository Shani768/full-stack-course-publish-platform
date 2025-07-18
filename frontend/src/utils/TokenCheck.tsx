import React, { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const TokenCheck = () => {
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found.');
      return;
    }

    try {
      const decoded: { exp: number } = jwtDecode(token);
      const currentTime = Date.now() / 1000; // in seconds

      const expiryDate = new Date(decoded.exp * 1000);
      console.log('Token expires at:', expiryDate.toLocaleString());

      if (decoded.exp < currentTime) {
        console.log('Token has expired.');
      } else {
        console.log('Token is valid.');
      }
    } catch (error) {
      console.log('Invalid token:', error);
    }
  }, []);

  const handleRemoveToken = () => {
    localStorage.removeItem('token');
    console.log('Token removed from localStorage.');
  };

  return (
    <div>
      <h2>TokenCheck</h2>
      <button onClick={handleRemoveToken}>Remove Token</button>
    </div>
  );
};

export default TokenCheck;
