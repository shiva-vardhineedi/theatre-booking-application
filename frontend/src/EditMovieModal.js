import React from 'react';
import MovieForm from './MovieForm';
import './EditMovieModal.css';

const EditMovieModal = ({ movie, onClose, onSave, onPosterChange }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Edit Movie</h2>
                {/* <MovieForm newMovie={movie} handleInputChange={() => {}} handlePosterUrlChange={() => {}} handleAddOrUpdateMovie={onSave} isEditing={true} /> */}
                <MovieForm
                    newMovie={movie}
                    handleInputChange={(e) => onSave({...movie, [e.target.name]: e.target.value})}
                    handlePosterUrlChange={(e) => onPosterChange(e)}
                    handleAddOrUpdateMovie={() => onSave(movie)}
                    isEditing={true}
                />
                <button className="close-btn" onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};

export default EditMovieModal;
