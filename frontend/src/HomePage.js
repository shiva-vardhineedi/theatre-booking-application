import React from "react";
import './HomePage.css'; // Add your CSS file here
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();

    const navigateToMovieSchedule = () => {
        navigate('/movie-schedule');
    };

    return (
        <div className="homepage">
            <h1>Welcome to Movie Schedules</h1>
            <p>Explore the latest movie schedules in your area.</p>
            <button className="btn btn-primary" onClick={navigateToMovieSchedule}>View Movie Schedule</button>
        </div>
    );
};

export default HomePage;