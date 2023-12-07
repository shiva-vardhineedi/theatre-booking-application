import React from 'react';
import './TheaterCapacityForm.css';

const TheaterCapacityForm = ({ theaters, selectedTheaterName, updatedCapacity, handleTheaterSelectionChange, handleCapacityChange, handleUpdateCapacity }) => {
    return (
        <div className="section">
            <h3>Update Theater Seating Capacity</h3>
            <div className="capacity-form">
                <select value={selectedTheaterName} onChange={handleTheaterSelectionChange}>
                    <option value="">Select Theater</option>
                    {theaters.map(theater => (
                        <option key={theater.theater_id} value={theater.name}>{theater.name}</option>
                    ))}
                </select>
                <input type="number" value={updatedCapacity} onChange={handleCapacityChange} placeholder="New Capacity" />
                <button onClick={handleUpdateCapacity}>Update Capacity</button>
            </div>
        </div>
    );
};

export default TheaterCapacityForm;
