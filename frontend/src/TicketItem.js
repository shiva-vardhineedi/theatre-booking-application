import React from 'react';
import './TicketItem.css'; // Create and import TicketItem.css for styling

const TicketItem = ({ ticket, onCancelClick }) => {
  return (
    <div className="ticket-item animated fadeIn">
      <h3>Movie: {ticket.movie_title}</h3>
      <p>Showtime: {new Date(ticket.showtime).toLocaleString()}</p>
      <p>Theater: {ticket.theater_name}</p>
      <p>Booking Id: {ticket.booking_id}</p>
      <p>Seat number: {ticket.seat_number}</p>
      {onCancelClick && (
        <button onClick={() => onCancelClick(ticket)}>Cancel Ticket</button>
      )}
      {/* Additional ticket details */}
    </div>
  );
};

export default TicketItem;
