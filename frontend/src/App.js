import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { useAuth } from './AuthContext';
import { useState, useEffect } from 'react';
import LoadingAnimation from './LoadingAnimation';
import "./App.css";


function App() {
  const navigate = useNavigate();
  const { setIsAuthenticated, setUserId, setIsGuest } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading delay
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingAnimation />;
  }

  const handleNavigate = (path,  isGuest = false) => {
    if (isGuest) {
      // Setting isAuthenticated to false and userId to null for guests
      setIsAuthenticated(false);
      setUserId(null);
      setIsGuest(true); // Set isGuest to true when navigating as a guest
    } else {
      setIsGuest(false); // Ensure isGuest is false for regular navigation
    }
    navigate(path);
  };

  const burstAndNavigate = (path, buttonElement, isGuest = false) => {
    // Apply burst animation
    buttonElement.classList.add('burst-animation');

    // Wait for the animation to complete before navigating
    setTimeout(() => {
      handleNavigate(path, isGuest);
    }, 500); // This should match the duration of the burst animation
  };

  return (
    <div className="app-container">
      <div className="title-container">
        <h1 className="app-title">SMC Movies</h1>
      </div>
      <p className="app-description">
        💃 Your gateway to the latest movies and entertainment 🕺
      </p>
      <div className="button-container">
        <button onClick={() => handleNavigate('/login')} className="app-button">Login</button>
        <button onClick={() => handleNavigate('/register')} className="app-button">Register</button>
        <button onClick={() => handleNavigate('/landing', true)} className="app-button">Continue as Guest</button>
        <button onClick={() => handleNavigate('/login')} className="app-button">Admin Login</button>
      </div>
    </div>
  );
}

export default App;
