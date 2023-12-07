import React from 'react';
import './AssignmentForm.css';

const AssignmentForm = ({ movies, theaters, handleAssignmentChange, handleAddAssignment, newAssignment, newDate }) => {
    return (
        <div className="section">
            <h3>Assign Movie to Theater</h3>
            <div className="assignment-form">
                <select name="movie_id" onChange={handleAssignmentChange}>
                    <option value="">Select Movie</option>
                    {movies.map(movie => (
                        <option key={movie.movie_id} value={movie.movie_id}>{movie.title}</option>
                    ))}
                </select>

                <select name="theater_id" onChange={handleAssignmentChange}>
                    <option value="">Select Theater</option>
                    {theaters.map(theater => (
                        <option key={theater.theater_id} value={theater.theater_id}>{theater.name}</option>
                    ))}
                </select>

                <input type="date" name="showtime_date" value={newDate} onChange={handleAssignmentChange} />
                <input type="time" name="showtime" onChange={handleAssignmentChange} />
                <button onClick={handleAddAssignment}>Assign Showtime</button>
            </div>
        </div>
    );
};

export default AssignmentForm;
