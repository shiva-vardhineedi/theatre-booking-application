import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminMovie.css';
import moment from 'moment-timezone';
import LogoutButton from './Logout';
import MovieForm from './MovieForm';
import MovieList from './MovieList';
import AssignmentForm from './AssignmentForm';
import TheaterCapacityForm from './TheaterCapacityForm';
import DiscountForm from './DiscountForm';
import AnalyticsSection from './AnalyticsSection';

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

        <MovieForm 
            newMovie={newMovie}
            handleInputChange={handleInputChange}
            handlePosterUrlChange={handlePosterUrlChange}
            handleAddMovie={handleAddMovie}
            handleUpdateMovie={handleUpdateMovie}
            selectedMovie={selectedMovie}
        />

        <MovieList
            movies={movies}
            handleEditMovie={handleEditMovie}
            handleUpdateMovie={handleUpdateMovie}
            handleDeleteMovie={handleDeleteMovie}
            handlePosterUrlChange={handlePosterUrlChange}
        />


        <AssignmentForm
            movies={movies}
            theaters={theaters}
            handleAssignmentChange={handleAssignmentChange}
            handleAddAssignment={handleAddAssignment}
        />

        <TheaterCapacityForm
            theaters={theaters}
            selectedTheaterName={selectedTheaterName}
            updatedCapacity={updatedCapacity}
            handleTheaterSelectionChange={handleTheaterSelectionChange}
            handleCapacityChange={handleCapacityChange}
            handleUpdateCapacity={handleUpdateCapacity}
        />

        <DiscountForm
            discountBeforeSix={discountBeforeSix}
            tuesdayDiscount={tuesdayDiscount}
            handleApplyDiscounts={handleApplyDiscounts}
            setDiscountBeforeSix={setDiscountBeforeSix}
            setTuesdayDiscount={setTuesdayDiscount}
        />

        <AnalyticsSection
            occupancyData={occupancyData}
            setPeriod={setPeriod}
        />
    </div>
);
}

export default AdminDashboard;