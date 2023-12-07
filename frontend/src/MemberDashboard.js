import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MemberDashboard() {
    const [bookings, setBookings] = useState([]);
    const [rewardsPoints, setRewardsPoints] = useState(0);
    const [moviesWatched, setMoviesWatched] = useState([]);

    // On component mount, fetch the user's bookings, reward points, and watched movies
    useEffect(() => {
        async function fetchData() {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };

                // Fetch user bookings
                const bookingResponse = await axios.get('http://localhost:5001/api/user/bookings', config);
                console.log('this is frontend output');
                console.log(bookingResponse);
                setBookings(bookingResponse.data);

                // Fetch user reward points
                const rewardResponse = await axios.get('http://localhost:5001/api/user/rewards', config);
                setRewardsPoints(rewardResponse.data.rewards_points);

                // Fetch movies watched in the past 30 days
                const moviesResponse = await axios.get('http://localhost:5001/api/user/watched-movies', config);
                setMoviesWatched(moviesResponse.data);

            } catch (error) {
                console.error('Error fetching data:', error);
                // Handle the error appropriately here
            }
        }

        fetchData();
    }, []);

    return (
        <div>
            <h2>Your Bookings</h2>
            <ul>
                {bookings.map((booking, index) => (
                    <li key={index}>
                            Schedule ID: {booking.schedule_id},
                            Number of Tickets: {booking.number_of_tickets},
                            Total Price: ${booking.total_price},
                            Booking Date: {booking.booking_date}
                    </li>

                ))}
            </ul>

            <h2>Reward Points: {rewardsPoints}</h2>

            <h2>Movies Watched in the Past 30 Days</h2>
            <ul>
                {moviesWatched.map((movie, index) => (
                    <li key={index}>{movie.title}</li>
                ))}
            </ul>
        </div>
    );
}

export default MemberDashboard;
