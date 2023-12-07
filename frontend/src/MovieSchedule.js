import React, { useEffect, useState } from 'react';
import './MovieSelector.css';

const MovieSelector = ({ movies, onMovieSelect }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pastMovies, setPastMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);

  useEffect(() => {
    const currentDate = new Date();
    const past = movies.filter(movie => new Date(movie.release_date) < currentDate);
    const upcoming = movies.filter(movie => new Date(movie.release_date) >= currentDate);

    setPastMovies(past);
    setUpcomingMovies(upcoming);
  }, [movies]);

  const handleNextClick = () => {
    if (currentIndex < pastMovies.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevClick = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="movie-container">
      <h3>Select a Movie:</h3>
      <div className="movie-cards">
        {pastMovies.map((movie, index) => (
          <div
            key={movie.movie_id}
            className={`movie-card ${index === currentIndex ? 'active' : ''}`}
            onClick={() => onMovieSelect(movie)}
          >
            <img src={movie.posterurl || 'default-image-url.jpg'} alt={movie.title} className="movie-image" />
            <h4>{movie.title}</h4>
            <button className="btn btn-primary" onClick={() => onMovieSelect(movie)}>Book</button>
          </div>
        ))}
      </div>
      
      <h3>Upcoming Movies:</h3>
      <div className="movie-cards">
        {upcomingMovies.map(movie => (
          <div key={movie.movie_id} className="movie-card">
            <img src={movie.posterurl || 'default-image-url.jpg'} alt={movie.title} className="movie-image" />
            <h4>{movie.title}</h4>
          </div>
        ))}
      </div>

      <div className="navigation-buttons">
        <button className="btn btn-secondary" onClick={handlePrevClick} disabled={currentIndex === 0}>Previous</button>
        <button className="btn btn-secondary" onClick={handleNextClick} disabled={currentIndex === pastMovies.length - 1}>Next</button>
      </div>
    </div>
  );
};

export default MovieSelector;
