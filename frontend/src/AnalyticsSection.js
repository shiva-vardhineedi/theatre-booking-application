import React from 'react';

const AnalyticsSection = ({ occupancyData, setPeriod }) => {
    return (
        <div className="dashboard-analytics">
            <h2 className="analytics-title">Theater Occupancy Analytics</h2>
            <div className="analytics-buttons">
                <button className="analytics-button" onClick={() => setPeriod('30')}>Last 30 Days</button>
                <button className="analytics-button" onClick={() => setPeriod('60')}>Last 60 Days</button>
                <button className="analytics-button" onClick={() => setPeriod('90')}>Last 90 Days</button>
            </div>
            <div className="analytics-data">
                <div className="analytics-data-section">
                    <h3 className="data-title">By Location:</h3>
                    {occupancyData.locationOccupancy.map(loc => (
                        <p key={loc.location}>{loc.region}: {loc.total_tickets} tickets sold</p>
                    ))}
                </div>
                <div className="analytics-data-section">
                    <h3 className="data-title">By Movie:</h3>
                    {occupancyData.movieOccupancy.map(movie => (
                        <p key={movie.movie_id}>{movie.theater_name}: {movie.total_tickets} tickets sold for {movie.movie_title}</p>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsSection;
