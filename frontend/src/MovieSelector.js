import React, { useEffect, useState } from 'react';
import './MovieSelector.css'; // Import your CSS file

const MovieSelector = ({ className, movies, onMovieSelect }) => {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pastMovies, setPastMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);

  useEffect(() => {
    // Filter movies based on release date
    const currentDate = new Date();
    const past = movies.filter(movie => new Date(movie.release_date) < currentDate);
    const upcoming = movies.filter(movie => new Date(movie.release_date) >= currentDate);

    console.log('upcoming movies',past);

    setPastMovies(past);
    setUpcomingMovies(upcoming);

    // Trigger the animation when the movies prop changes and is not empty
    if (movies.length > 0) {
      setShouldAnimate(true);
    }
  }, [movies]);

  const canScrollLeft = currentIndex > 0;
  const canScrollRight = currentIndex < pastMovies.length - 1;

  const handleNextClick = () => {
    if (canScrollRight) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevClick = () => {
    if (canScrollLeft) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div>
      <h3>Select a Movie:</h3>
      <div className={`movie-container ${shouldAnimate ? 'fade-in' : ''}`}>
      <div className="movie-cards">
        {pastMovies.map((movie, index) => (
          <div
            key={movie.movie_id}
            className={`movie-card ${index === currentIndex ? 'active' : ''}`}
            onClick={() => onMovieSelect(movie)}
          >
            {
              movie.posterurl &&
              <img
              src={movie.posterurl}
              alt={movie.title}
              className="movie-image"
            />
            }
            {
              !movie.posterurl &&
              <img
              src={"https://www.celebritycruises.com/blog/content/uploads/2022/07/what-is-california-known-for-the-golden-gate-bridge-hero.jpg"}
              alt={movie.title}
              className="movie-image"
            />
            }
            
            <h4>{movie.title}</h4>
            <button className="btn btn-primary" onClick={() => onMovieSelect(movie)}>Book</button>
          </div>
        ))}
      </div>
      </div>
      
      <div className={`movie-container ${shouldAnimate ? 'fade-in' : ''}`}>
      <h3>Upcoming Movies:</h3>
      <div className="movie-cards">
        {upcomingMovies.map(movie => (
          <div key={movie.movie_id} className="movie-card">
            <img
              src="https://www.celebritycruises.com/blog/content/uploads/2022/07/what-is-california-known-for-the-golden-gate-bridge-hero.jpg"
              alt={movie.title}
              className="movie-image"
            />
            <h4>{movie.title}</h4>
            {/* No booking button for upcoming movies */}
          </div>
        ))}
      </div>
    </div>

      <div className="navigation-buttons">
        <button
          className="btn btn-secondary"
          onClick={handlePrevClick}
          disabled={currentIndex === 0}
        >
          Previous
        </button>
        <button
          className="btn btn-secondary"
          onClick={handleNextClick}
          disabled={currentIndex === pastMovies.length - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MovieSelector;

