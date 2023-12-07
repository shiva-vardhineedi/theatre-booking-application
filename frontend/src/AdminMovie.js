import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminMovie.css';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';


import LogoutButton from './Logout';
import moment from 'moment-timezone';
function AdminDashboard() {
    const [movies, setMovies] = useState([]);
    const [newMovie, setNewMovie] = useState({ title: '', description: '', duration: '', release_date: '', posterurl: '' });
    const [theaters, setTheaters] = useState([]);
    const [showtimes, setShowtimes] = useState([]);
    const [newAssignment, setNewAssignment] = useState({ movie_id: '', theater_id: '', showtime: '' });
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [newDate, setNewDate] = useState('');
    const [selectedTheaterName, setSelectedTheaterName] = useState('');
    const [updatedCapacity, setUpdatedCapacity] = useState('');
    const [discountBeforeSix, setDiscountBeforeSix] = useState('');
    const [tuesdayDiscount, setTuesdayDiscount] = useState('');
    const sanJoseToday = moment.tz('America/Los_Angeles').format('YYYY-MM-DD');
    const [occupancyData, setOccupancyData] = useState({
        locationOccupancy: [],
        movieOccupancy: []
      });
      const [period, setPeriod] = useState('30'); // Default period is set to '30' for 30 days
    // Fetch movies, theaters, and showtimes on component mount
    useEffect(() => {
        async function fetchData() {
            try {
                const moviesResponse = await axios.get('http://localhost:5001/admin/movies');
                setMovies(moviesResponse.data);

                const theatersResponse = await axios.get('http://localhost:5001/admin/theaters');
                console.log("Theaters:", theatersResponse.data); // Add this line for debugging
                setTheaters(theatersResponse.data);

                const showtimesResponse = await axios.get('http://localhost:5001/admin/showtimes');
                setShowtimes(showtimesResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, []);

    const getChartData = () => {
        // Sort the data to get top 5 movies by occupancy
        const sortedData = [...occupancyData.movieOccupancy]
          .sort((a, b) => b.total_tickets - a.total_tickets)
          .slice(0, 5);
      
        return {
          labels: sortedData.map(data => data.movie_title),
          datasets: [
            {
              label: 'Tickets Sold',
              data: sortedData.map(data => data.total_tickets),
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
          ],
        };
      };

      
    // ... other functions like handleInputChange, handleAddMovie, etc.
    const fetchMovies = async () => {
        try {
            const response = await axios.get('http://localhost:5001/admin/movies');
            setMovies(response.data.movies || response.data);
        } catch (error) {
            console.error('Error fetching movies:', error);
        }
    };
    const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMovie((prevMovie) => ({ ...prevMovie, [name]: value }));
};  
const handlePosterUrlChange = (e) => {
    setNewMovie({ ...newMovie, posterurl: e.target.value });
};

    const handleAddMovie = async () => {
    
    const movieExists = movies.some(movie => movie.title.toLowerCase() === newMovie.title.toLowerCase());

    if (movieExists) {
        alert('A movie with this title already exists!');
        return;
     }

    try {
        await axios.post('http://localhost:5001/admin/add-movie', newMovie);
        const moviesResponse = await axios.get('http://localhost:5001/admin/movies');
        console.log(moviesResponse.data,"*****");
        setMovies(moviesResponse.data);
    } catch (error) {
        console.error('Error adding movie:', error);
    }
};
    const handleEditMovie = (movie) => {
    setSelectedMovie(movie);
    setNewMovie(movie);
};
    const handleAssignmentChange = (e) => {
        const { name, value } = e.target;
        if (name === 'showtime_date') {
            setNewDate(value);
        } else {
            setNewAssignment({ ...newAssignment, [name]: value });
        }
};

    const handleAddAssignment = async () => {
    try {
        const combinedShowtime = `${newDate}T${newAssignment.showtime}`;
        await axios.post('http://localhost:5001/admin/add-showtime',  { ...newAssignment, showtime: combinedShowtime });
        // You might want to fetch updated showtimes here if needed
        // e.g., fetchShowtimes();
        const theaterResponse = await axios.get('http://localhost:5001/admin/theaters');
        console.log(theaterResponse.data,"*****");
        setMovies(theaterResponse.data);
        alert('Showtime assigned successfully');
    } catch (error) {
        console.error('Error adding showtime assignment:', error);
    }
};  
        const handleUpdateMovie = async () => {
    try {
        await axios.put(`http://localhost:5001/admin/update-movie/${selectedMovie.movie_id}`, newMovie);
        fetchMovies();
        setSelectedMovie(null);
    } catch (error) {
        console.error('Error updating movie:', error);
    }
};

    const handleDeleteMovie = async (movieId) => {
    try {
        await axios.delete(`http://localhost:5001/admin/delete-movie/${movieId}`);
        fetchMovies();
    } catch (error) {
        console.error('Error deleting movie:', error);
    }
};
    const fetchTheaters = async () => {
    try {
        const response = await axios.get('http://localhost:5001/admin/theaters');
        setTheaters(response.data.theaters || response.data);
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
};
    const handleTheaterSelectionChange = (e) => {
    setSelectedTheaterName(e.target.value);
};

    const handleCapacityChange = (e) => {
    setUpdatedCapacity(e.target.value);
};
    const handleUpdateCapacity = async () => {
    try {
        await axios.put('http://localhost:5001/admin/update-theater-seating', { name: selectedTheaterName, seating_capacity: updatedCapacity });
        fetchTheaters();
        console.log("theaters %%%%%%%%%%%%%%%%%%%%%%%%%%");
        alert('Seating capacity updated!');
    } catch (error) {
        console.error('Error updating seating capacity', error);
        alert('Failed to update seating capacity');
    }
};
    const handleApplyDiscounts = async (e) => {
    e.preventDefault();
    try {
        // Call to backend endpoint to apply discounts
        await axios.post('http://localhost:5001/admin/apply-discounts', {
            discountBeforeSix,
            tuesdayDiscount
        });
        alert('Discount prices configured successfully!');
    } catch (error) {
        console.error('Error configuring discount prices:', error);
        alert('Failed to configure discount prices');
    }
};


  // Function to fetch theater occupancy data
  useEffect(() => {
    const fetchOccupancyData = async () => {
      try {
        // Fetch occupancy data by location
        const locationResponse = await axios.get(`http://localhost:5001/admin/theater-occupancy-by-location?period=${period}`);
        // Fetch occupancy data by movie
        const movieResponse = await axios.get(`http://localhost:5001/admin/theater-occupancy-by-movie?period=${period}`);

        setOccupancyData({
          locationOccupancy: locationResponse.data,
          movieOccupancy: movieResponse.data
        });
      } catch (error) {
        console.error('Error fetching occupancy data:', error);
      }
    };

    fetchOccupancyData();
}, [period]);

    return (
        <div className="admin-dashboard">
            <div className="header">
                <h1>Admin Dashboard</h1>
                <LogoutButton />
            </div>
            <h2>Movie Management</h2>
            <div className="section">
                {/* Display a form to add a new movie */}
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
          <input type="date" name="release_date" value={newMovie.release_date}  min={sanJoseToday} onChange={handleInputChange} />
        </div>
        <div className="input-group">
          <input type="text" name="poster_url" value={newMovie.posterurl} placeholder="Poster URL" onChange={handlePosterUrlChange}/>
        </div>
        {selectedMovie ? (
          <button onClick={handleUpdateMovie}>Update Movie</button>
        ) : (
          <button onClick={handleAddMovie}>Add Movie</button>
        )}
      </div>
               
    <div className="section movie-list">
      {/* Movie Items */}
      {movies && movies.map(movie => (
        <div key={movie.movie_id} className="movie-item">
            <h4>{movie.title}</h4>
            {/* Display the poster image or a placeholder if there is no poster */}
            {movie.posterurl ? (
                <img src={movie.posterurl} alt={`${movie.title} Poster`} />
                ) : (
                <div className="no-poster">
                    🍿🎬
                </div>
                )}
            <p>{movie.description}</p>
            <div className="movie-actions">
            <button className="edit-btn" onClick={() => handleEditMovie(movie)}>Edit</button>
            <button className="delete-btn" onClick={() => handleDeleteMovie(movie.movie_id)}>Delete</button>
            </div>
        </div>
        ))}

    </div>
            </div>
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
                            <option key={theater.theater_id} value={theater.theater_id}>{theater.region}</option>
                        ))}
                    </select>

                    <input type="date" name="showtime_date" min={sanJoseToday}onChange={handleAssignmentChange} />
                    <input type="time" name="showtime" onChange={handleAssignmentChange} />
                    <button onClick={handleAddAssignment}>Assign Showtime</button>
                </div>
            </div>
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
            <div  className="section configure-discounts">
                <h2>Configure Discount Prices</h2>
                <form onSubmit={handleApplyDiscounts}>
                <div className="input-group">
                        <label>
                            Discount before 6 PM (%):
                            <input
                                type="number"
                                value={discountBeforeSix}
                                onChange={(e) => setDiscountBeforeSix(e.target.value)}
                            />
                        </label>
                    </div>
                    <div className="input-group">
                        <label>
                            Tuesday Discount (%):
                            <input
                                type="number"
                                value={tuesdayDiscount}
                                onChange={(e) => setTuesdayDiscount(e.target.value)}
                            />
                        </label>
                    </div>
                    <button type="submit">Apply Discounts</button>
                </form>
            </div>
            <div className="dashboard-analytics">
        <h2 className="analytics-title">Theater Occupancy Analytics</h2>
        <div className="analytics-buttons">
          <button className="analytics-button" onClick={() => setPeriod('30')}>Last 30 Days</button>
          <button className="analytics-button" onClick={() => setPeriod('60')}>Last 60 Days</button>
          <button className="analytics-button" onClick={() => setPeriod('90')}>Last 90 Days</button>
        </div>
        <div className="analytics-data">
          {/* Occupancy Data by Location */}
          <div className="analytics-data-section">
            <h3 className="data-title">By Location:</h3>
            {occupancyData.locationOccupancy.map(loc => (
              // Make sure to use 'loc.location' instead of 'loc.theater_name'
              <p key={loc.location}>{loc.region}: {loc.total_tickets} tickets sold</p>
            ))}
          </div>
          {/* Occupancy Data by Movie */}
          <div className="analytics-data-section">
            <h3 className="data-title">By Movie:</h3>
            {occupancyData.movieOccupancy.map(movie => (
              <p key={movie.movie_id}>{movie.theater_name}: {movie.total_tickets} tickets sold for {movie.movie_title}</p>
            ))}
            <div className="analytics-data-section by-movie-analytics">
                <h3 className="data-title">By Movie:</h3>
                <Bar data={getChartData()} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
      </div>

            
        </div>
    );
}

export default AdminDashboard;