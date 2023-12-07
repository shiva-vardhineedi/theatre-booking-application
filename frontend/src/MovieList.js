import React, { useState } from 'react';
import './MovieList.css';
import EditMovieModal from './EditMovieModal';

const MovieList = ({ movies, handleEditMovie, handleUpdateMovie, handleDeleteMovie, handlePosterUrlChange }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const openModal = (movie) => {
        setSelectedMovie(movie);
        setIsModalOpen(true);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const filteredMovies = movies.filter(movie => 
        movie.title.toLowerCase().includes(searchTerm)
    );

    return (
        <div className="section movie-list">
            <div className="movieList-header">
                <h3>List of Movies</h3>
                <input 
                    type="text" 
                    placeholder="Search movies..." 
                    onChange={handleSearchChange} 
                    className="movie-search-input"
                />
            </div>
            <div className="movieList-Content">
            {filteredMovies.map(movie => (
                <div key={movie.movie_id} className="movie-item">
                    <h4>{movie.title}</h4>
                    {movie.posterurl ? (
                        <img src={movie.posterurl} alt={`${movie.title} Poster`} />
                    ) : (
                        <div className="default-poster">
                            🎬🍿
                        </div>
                    )}
                    <p>{movie.description}</p>
                    <div className="movie-actions">
                        <button className="edit-btn" onClick={() => openModal(movie)}>Edit</button>
                        <button className="delete-btn" onClick={() => handleDeleteMovie(movie.movie_id)}>Delete</button>
                    </div>
                </div>
            ))}
            </div>


            {isModalOpen && (
                <EditMovieModal
                    movie={selectedMovie}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleUpdateMovie}
                    onPosterChange={handlePosterUrlChange}
                />
            )}
            {/* {isModalOpen && <EditMovieModal movie={selectedMovie} onClose={() => setIsModalOpen(false)} onSave={() => handleUpdateMovie()} onPosterChange={() => handlePosterUrlChange()} />} */}
        </div>
    );
};

export default MovieList;
