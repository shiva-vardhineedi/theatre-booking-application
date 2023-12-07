import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './Booking.css';
import LogoutButton from './Logout';
import { useAuth } from './AuthContext';



const Booking = () => {
  const location = useLocation();
  const { userId } = useAuth();
  const { movie, schedule_id } = location.state;
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showInfo, setShowInfo] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const navigate = useNavigate();
  const SEATS_PER_ROW = 18;
  const MID_ROW_INDEX = SEATS_PER_ROW / 2;

  useEffect(() => {
    // Fetch booked seats for the specific schedule
    const fetchBookedSeats = async () => {
      try {
        const response = await axios.get(`/api/seats/booked?schedule_id=${schedule_id}`);
        setBookedSeats(response.data);
        console.log('movies data', showInfo);
        
        const t_response = await axios.get(`/api/show/selected?schedule_id=${schedule_id}`);
        console.log('booked seats',t_response.data);
        setShowInfo(t_response.data);

      } catch (error) {
        console.error('Error fetching booked seats:', error);
      }
    };
  
    if (schedule_id) {
      fetchBookedSeats();
    }
  }, [schedule_id]);

  const handleSeatSelection = (seat) => {
    // Check if the seat is already selected
    if (selectedSeats.includes(seat)) {
      // If selected, remove it
      setSelectedSeats(selectedSeats.filter((selectedSeat) => selectedSeat !== seat));
    } else {
      // If not selected, add it only if less than 8 seats are already selected
      if (selectedSeats.length < 8) {
        setSelectedSeats([...selectedSeats, seat]);
      } else {
        // Optionally, alert the user that they can't select more than 8 seats
        alert("You can't select more than 8 seats.");
      }
    }
  };

  const handleBooking = async () => {

    navigate('/checkout', {
      state: {
        movie: movie,
        schedule_id: schedule_id,
        selectedSeats: selectedSeats,
        showInfo: showInfo
      }
    });
    };

    const handleBackClick = () => {
      navigate('/landing');
    };
    
    

  const seatingCapacity = showInfo.seating_capacity;

return (
  <div className="booking-container">
      <div className="booking-header">
        <button className="back-button" onClick={handleBackClick}>Back</button>
        <h1>{movie.title} at {showInfo.theater_name}</h1>
        <LogoutButton className="logout-button" />
      </div>
      <div className="screen-indicator">Screen this way</div>
    <div className="seats-layout">
    {Array.from({ length: Math.ceil(seatingCapacity / SEATS_PER_ROW) }, (_, rowIndex) => (
        <div key={rowIndex} className="seat-row">
          {Array.from({ length: SEATS_PER_ROW }, (_, seatIndex) => {
            const seatNumber = rowIndex * SEATS_PER_ROW + seatIndex + 1;
            if (seatNumber > seatingCapacity) return null; // Don't render excess seats
            const isWalkway = seatIndex === MID_ROW_INDEX; // Check for the walkway
            return isWalkway ? <div className="walkway-space"></div> : (
              <button
                key={seatNumber}
                onClick={() => handleSeatSelection(seatNumber)}
                disabled={bookedSeats.includes(seatNumber)}
                className={`seat-button ${selectedSeats.includes(seatNumber) ? 'selected' : ''} ${bookedSeats.includes(seatNumber) ? 'booked' : ''}`}
              >
                {seatNumber}
              </button>
            );
          })}
        </div>
      ))}
    </div>
      <div className="booking-footer">
        <div className="price-info">
          <p>Price per Ticket: ${showInfo.price}</p>
        </div>
        <button onClick={handleBooking} className="confirm-booking-btn">
          Confirm Booking
        </button>
      </div>
    </div>
  );
};

export default Booking;
