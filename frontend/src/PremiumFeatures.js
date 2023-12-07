import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PremiumFeatures.css';


const PremiumFeatures = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { formData } = location.state;
    const [paymentMethod, setPaymentMethod] = useState('');
    const [message, setMessage] = useState('');

    const handlePaymentSubmission = async () => {
        try {
            // Assuming payment logic is handled separately
            // Now, registering the user
            const response = await axios.post('http://localhost:5001/auth/register', formData);
            setMessage(`Premium User registered with ID: ${response.data.user_id}`);
            
            //Redirect to login page after 2 seconds
            setTimeout(() => {
                navigate('/login');
            }, 4000);
        } catch (error) {
            setMessage(`Registration failed: ${error.message}`);
        }
    };

    return (
        <div className="premium-container">
            <h2>Premium Membership Features</h2>
            <ul className="premium-features-list">
                <li>Premium members get online service fee waived for any booking.</li>
                <li>Get first notified about offers.</li>
                <li>Cancel previous tickets before showtime and request a refund.</li>
            </ul>
            <div className="label-select">
                <label>
                    Payment Method:
                    <select onChange={(e) => setPaymentMethod(e.target.value)}>
                        <option value="">Select Payment Method</option>
                        <option value="card">Card</option>
                        <option value="onlineBanking">Online Banking</option>
                    </select>
                </label>
            </div>
    
            <div className="payment-details">
                {paymentMethod === 'card' && (
                    <>
                        <input type="text" placeholder="Card Number" />
                        <input type="text" placeholder="Expiry Date" />
                        <input type="text" placeholder="CVV" />
                    </>
                )}
    
                {paymentMethod === 'onlineBanking' && (
                    <>
                        <input type="text" placeholder="Username" />
                        <input type="password" placeholder="Password" />
                    </>
                )}
            </div>
    
            <button className="submit-button" onClick={handlePaymentSubmission}>Complete Purchase</button>
            {message && <p className="message">{message}</p>}
        </div>
    );
    
};

export default PremiumFeatures;
