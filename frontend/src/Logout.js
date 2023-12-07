import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './Logout.css';

const LogoutButton = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated, setUserId } = useAuth();

  const handleLogout = () => {
    // Clear user data and tokens from local storage or any state management
    localStorage.removeItem('token');
    localStorage.removeItem('role'); // Remove the user role as well
    setIsAuthenticated(false);
    setUserId(null);
    navigate('/'); // Navigate to the homepage or login page
  };

  return (
    <button onClick={handleLogout} className="logout-button">Logout</button>
  );
};

export default LogoutButton;
