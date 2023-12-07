import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LogoutButton from './Logout';
import Navbar from './Navbar';
import RegionSelector from './RegionSelector';
import MovieSelector from './MovieSelector';
import ShowtimeSelector from './ShowtimeSelector';
import './Landing.css';
import { useAuth } from './AuthContext';
import { Container, Row, Col, Button, Form, InputGroup, FormControl } from 'react-bootstrap';

const Landing = () => {
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [theaterShowtimes, setTheaterShowtimes] = useState([]);
  const { userId } = useAuth();
  const history = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/regions');
        setRegions(response.data);
      } catch (error) {
        console.error('Error fetching regions:', error);
      }
    };
    fetchRegions();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const getFilteredRegions = () => {
    return regions.filter(region =>
      region.region.toLowerCase().includes(searchTerm)
    );
  };

  const getFilteredMovies = () => {
    return movies.filter(movie =>
      movie.title.toLowerCase().includes(searchTerm)
    );
  };

  const handleRegionSelect = async (region) => {
    setSelectedRegion(region);
    setSelectedMovie(null);
    setSearchTerm(''); // Reset search term when a region is selected
    try {
      const response = await axios.get(`http://localhost:5001/api/regions/${region.region}/movies`);
      setMovies(response.data);
      console.log('this is the movies data', response.data);
    } catch (error) {
      console.error('Error fetching movies for region:', error);
    }
  };

  const handleMovieSelect = async (movie) => {
    setSelectedMovie(movie);
    setSearchTerm(''); // Reset search term when a movie is selected
    try {
      const response = await axios.get(`http://localhost:5001/api/movies/${movie.movie_id}/theaters?region_id=${selectedRegion.region}`);
      console.log('showtime for the moive',response.data);
      setTheaterShowtimes(response.data);
    } catch (error) {
      console.error('Error fetching theaters for movie:', error);
    }
  };

  const handleBookTicket = (showtime) => {
    history('/booking', { state: { movie: selectedMovie, schedule_id: showtime.schedule_id, user_id: userId } });
  };

  const handleGoBack = () => {
    if (selectedMovie) {
      setSelectedMovie(null);
    } else if (selectedRegion) {
      setSelectedRegion(null);
      setMovies([]);
    }
  };

  return (
    <div className="landing-container">
      <Navbar />
      <header className="landing-header">
        <h1>Welcome to the Cinema</h1>
      </header>
      
      <div className="content-container">
        <div className="sidebar">
          {selectedRegion && !selectedMovie && (
            <button className="btn-back" onClick={handleGoBack}>Back to Regions</button>
          )}

          {selectedMovie && (
            <button className="btn-back" onClick={handleGoBack}>Back to Movies</button>
          )}
        </div>
        
        <div className="main-content">
          <input 
            type="text" 
            className="search-bar" 
            placeholder="Search..." 
            value={searchTerm} 
            onChange={handleSearchChange} 
          />

          {!selectedRegion && !selectedMovie && (
            <RegionSelector 
              className="region-selector" 
              regions={getFilteredRegions()} 
              onRegionSelect={handleRegionSelect} 
            />
          )}

          {selectedRegion && !selectedMovie && (
            <MovieSelector 
              className="movie-selector" 
              movies={getFilteredMovies()} 
              onMovieSelect={handleMovieSelect} 
            />
          )}

          {selectedMovie && (
            <ShowtimeSelector 
              className="showtime-selector" 
              theaterShowtimes={theaterShowtimes} 
              onBookTicket={handleBookTicket} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Landing;
