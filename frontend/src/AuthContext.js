// AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    // Perform the authentication check on component mount and whenever isAuthenticated changes
    console.log('Checking authentication status');
    const token = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('user_id'); // Get the stored user ID

    if (token) {
      setIsAuthenticated(true);
      setUserId(storedUserId); // Set the user ID if a token is present
    }
  }, [isAuthenticated]); // Dependency array

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, userId, setUserId, isGuest, setIsGuest }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);
