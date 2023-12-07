import React from 'react';
import './MovieForm.css';

const MovieForm = ({ newMovie, handleInputChange, handlePosterUrlChange, handleAddOrUpdateMovie, isEditing }) => {
    return (
        <div className="movie-form">
            <div className="input-group">
                <input type="text" name="title" value={newMovie.title} placeholder="Movie Title" onChange={handleInputChange} />
            </div>
            <div className="input-group">
                <textarea name="description" value={newMovie.description} placeholder="Movie Description" onChange={handleInputChange}></textarea>
            </div>
            <div className="input-group">
                <input type="number" name="duration" value={newMovie.duration} placeholder="Duration (in mins)" onChange={handleInputChange} />
            </div>
            <div className="input-group">
                <input type="date" name="release_date" value={newMovie.release_date} onChange={handleInputChange} />
            </div>
            <div className="input-group">
                <input type="text" name="poster_url" value={newMovie.posterurl} placeholder="Poster URL" onChange={e => handlePosterUrlChange({...newMovie, posterurl: e.target.value})}/>
            </div>
            {isEditing ? (
                <button onClick={() => handleAddOrUpdateMovie(newMovie)}>Update Movie</button>
            ) : (
                <button onClick={() => handleAddOrUpdateMovie(newMovie)}>Add Movie</button>
            )}
        </div>
    );
};

export default MovieForm;
