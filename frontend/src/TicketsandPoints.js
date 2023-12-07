import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './TicketsandPoints.css';
import Navbar from './Navbar';
import TicketItem from './TicketItem';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const TicketsAndPoints = () => {
  const [purchasedTickets, setPurchasedTickets] = useState([]);
  const [rewardPoints, setRewardPoints] = useState(0);
  const { userId } = useAuth();
  const navigate = useNavigate();
  const upcomingRef = useRef(null);
  const pastRef = useRef(null);

  useEffect(() => {
    const fetchPurchasedTicketsAndRewards = async () => {
      try {
        const ticketsResponse = await axios.get(`http://localhost:5001/api/user/${userId}/tickets`);
        setPurchasedTickets(ticketsResponse.data);

        const rewardsResponse = await axios.get(`http://localhost:5001/api/user/${userId}/rewards`);
        setRewardPoints(rewardsResponse.data.rewards_points);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    if (userId) {
      fetchPurchasedTicketsAndRewards();
    }
  }, [userId]);

  const handleCancelClick = (ticket) => {
    navigate('/cancel', { state: { ticket } });
  };

  const classifyTickets = () => {
    const currentDate = new Date();
    return purchasedTickets.reduce((acc, ticket) => {
      const ticketDate = new Date(ticket.showtime);
      if (ticketDate >= currentDate) {
        acc.upcoming.push(ticket);
      } else {
        acc.past.push(ticket);
      }
      return acc;
    }, { upcoming: [], past: [] });
  };

  const handleScroll = (ref, direction) => {
    if (direction === 'left') {
      ref.current.scrollLeft -= 300; // adjust scroll step as needed
    } else {
      ref.current.scrollLeft += 300; // adjust scroll step as needed
    }
  };

  const { upcoming, past } = classifyTickets();

  const renderTicketList = (tickets, ref) => {
    const currentDate = new Date();
  
    return tickets.length > 0 ? (
      <>
        <FaArrowLeft className="scroll-arrow" onClick={() => handleScroll(ref, 'left')} />
        <div className="tickets-list" ref={ref}>
          {tickets.map(ticket => {
            const isFutureShowtime = new Date(ticket.showtime) > currentDate;
  
            return (
              <TicketItem 
                key={`${ticket.booking_id}-${ticket.seat_number}`} 
                ticket={ticket} 
                onCancelClick={isFutureShowtime ? () => handleCancelClick(ticket) : null} 
              />
            );
          })}
        </div>
        <FaArrowRight className="scroll-arrow" onClick={() => handleScroll(ref, 'right')} />
      </>
    ) : (
      <div className="no-tickets-message">No tickets available.</div>
    );
  };

  return (
    <div id="ticketsAndPageOuter" style={{"padding": "2rem", "maxWidth": "1200px", "margin": "auto", "textAlign": "center"}}>
      <Navbar currentPage="tickets" />

      <div className="reward-points-display">
        <h3>Your Reward Points: {rewardPoints}</h3>
      </div>

      <div className="tickets-container">
        <h2>Booked Tickets</h2>
        <div className="ticket-scroll-container">
          {renderTicketList(upcoming, upcomingRef)}
        </div>

        <h2>Past Tickets</h2>
        <div className="ticket-scroll-container">
          {renderTicketList(past, pastRef)}
        </div>
      </div>
    </div>
  );
};

export default TicketsAndPoints;
