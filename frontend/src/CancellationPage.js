import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CancellationPage.css'

const CancellationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { ticket } = location.state;
  const [cancellationReason, setCancellationReason] = useState('');
  const [refundOption, setRefundOption] = useState('refund'); // Default to 'refund'
  const [successMessage, setSuccessMessage] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('ticket cancelling is', ticket);
      await axios.post(`http://localhost:5001/api/tickets/${ticket.booking_id}/cancel`, {
        cancellationReason,
        refundOption,
        seatNumber: ticket.seat_number
      });
      // Handle successful cancellation (e.g., navigate back to tickets page, show a success message)
      setSuccessMessage('Ticket cancelled successfully.');

    setTimeout(() => {
      navigate('/tickets');
    }, 3000); // Redirect after 3 seconds
    } catch (error) {
      console.error('Error canceling ticket:', error);
    }
  };

  return (
    <div className="cancellation-container">
      <h2>Cancel Ticket</h2>
      <form className="cancellation-form" onSubmit={handleSubmit}>
        <label>
          Cancellation Reason:
          <textarea value={cancellationReason} onChange={(e) => setCancellationReason(e.target.value)} />
        </label>
        <label>
          Refund Option:
          <select value={refundOption} onChange={(e) => setRefundOption(e.target.value)}>
            <option value="refund">Request Refund</option>
            <option value="points">Add to Points</option>
          </select>
        </label>
        <button type="submit">Submit Cancellation</button>
      </form>
      {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
  );
};

export default CancellationPage;
