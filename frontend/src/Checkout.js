import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext';
import "./Checkout.css"

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { userId, isGuest} = useAuth();
    const { movie, schedule_id, selectedSeats, showInfo } = location.state;
    const [useRewards, setUseRewards] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [rewardPoints, setRewardPoints] = useState(0); // Assume this is fetched from user's data
    const [priceAfterPoints, setPriceAfterPoints] = useState(0);
    const [remainingPoints, setRemainingPoints] = useState(0);
    const [isPremiumUser, setIsPremiumUser] = useState(false); // New state for premium user status
    const [guestEmail, setGuestEmail] = useState(''); // New state for guest email
    const [guestPhoneNumber, setGuestPhoneNumber] = useState(''); // New state for guest phone number

    const [showConfetti, setShowConfetti] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [bankUsername, setBankUsername] = useState('');
    const [bankPassword, setBankPassword] = useState('');



    useEffect(() => {
        // Fetch the user's reward points from the API
        const fetchRewardPoints = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/api/user/${userId}/rewards`);
                setRewardPoints(response.data.rewards_points); // Update this path according to your API response
                console.log('reward points', rewardPoints);

                const userInfoResponse = await axios.get(`http://localhost:5001/api/user/${userId}/premiumcheck`);
                setIsPremiumUser(userInfoResponse.data.isPremium); // Update this path according to your API response

                console.log('check user premium or not', userInfoResponse.data.isPremium);


            } catch (error) {
                console.error('Error fetching reward points:', error);
            }
        };
    
        if (userId) {
            fetchRewardPoints();
        }
    }, [userId]);

    const pointsValue = rewardPoints / 10; // Assuming 10 points = $1

    const handleUseRewardsToggle = () => {
        const newUseRewards = !useRewards;
        setUseRewards(newUseRewards);
    
        // If the user chooses to use reward points, update the price
        if (newUseRewards) {
            // If the reward points cover the total price, set priceAfterPoints to 0
            setPriceAfterPoints(Math.max(totalPrice - pointsValue, 0));
            setRemainingPoints(Math.max(rewardPoints - (totalPrice * 10), 0));
        } else {
            // If not using reward points, reset to original price
            setPriceAfterPoints(totalPrice);
            setRemainingPoints(rewardPoints);
        }
    };
    

    

    // Calculate total price based on selected seats and show info
    const basePrice = selectedSeats.length * (showInfo.price || 20);
    const bookingFee = isPremiumUser ? 0 : 1.5; // Waive booking fee for premium users
    const totalPrice = basePrice + bookingFee * selectedSeats.length;

    const handlePayment = async () => {
        // Check if the user has enough points and opts to use them
        if (isGuest) {
            try {
                const bookingResponse = await axios.post('http://localhost:5001/api/guestbookings', {
                    schedule_id: schedule_id,
                    selected_seats: selectedSeats
                });
                console.log('Guest booking successful:', bookingResponse.data);
                alert('Guest booking successful!');
                setTimeout(() => navigate('/landing'), 2000);

                return;
            } catch (error) {
                console.error('Error during guest booking:', error);
                alert('Guest booking failed! Please try again.');
            }
        }

        if (useRewards && priceAfterPoints <= 0) {
            // Finalize the booking using reward points only
            try {
                const bookingResponse = await axios.post('http://localhost:5001/api/bookings', {
                    user_id: userId,
                    schedule_id: schedule_id,
                    selected_seats: selectedSeats,
                    use_rewards: useRewards
                });
                console.log('Booking successful with points:', bookingResponse.data);
                alert('Booking successful! Your reward points have been applied.');
                navigate('/tickets');
            } catch (error) {
                console.error('Error during booking with points:', error);
                alert('Booking failed with points! Please try again.');
            }
        } else if (paymentMethod && priceAfterPoints > 0) {
            // Process payment for the remaining balance
            try {
                const paymentSuccess = true;
                if (paymentSuccess) {
                    // If payment is successful, finalize the booking
                    const bookingResponse = await axios.post('http://localhost:5001/api/bookings', {
                        user_id: userId,
                        schedule_id: schedule_id,
                        selected_seats: selectedSeats,
                        use_rewards: useRewards,
                        payment_method: paymentMethod
                        // Additional information like the actual amount paid might be required
                    });
                    console.log('Booking successful after payment:', bookingResponse.data);
                    // alert('Payment successful! Booking confirmed.');
                    setShowConfetti(true);
                    setShowSuccessPopup(true);
                    setTimeout(() => {
                        setShowConfetti(false);
                        setShowSuccessPopup(false);
                        navigate('/tickets');
                    }, 5000);
                    // navigate('/tickets');
                } else {
                    throw new Error('Payment failed');
                }
            } catch (error) {
                console.error('Payment or booking failed:', error);
                alert('Payment failed! Please try again.');
            }
        }
    };
    

    return (
        <div className="checkout-container">
            {showConfetti && <Confetti />}
            {showSuccessPopup && (
                <div className="success-popup">
                    <span>🍿🎬 Booking Successful! 🎬🍿</span>
                </div>
            )}
            <h2>Checkout</h2>
            <div className="ticket-details">
                <h3>Movie Ticket Details</h3>
                <p><strong>Movie:</strong> {movie.title}</p>
                <p><strong>Theater:</strong> {showInfo.theater_name}</p>
                <p><strong>Showtime:</strong> {new Date(showInfo.showtime).toLocaleString()}</p>
                <p><strong>Seats:</strong> {selectedSeats.join(', ')}</p>
                <p><strong>Price per Ticket:</strong> ${showInfo.price || 20}</p>
                <p><strong>Online fees per ticket:</strong> $1.5</p>
                {!isGuest && <p><strong>Rewards points:</strong> {rewardPoints}</p>}
            </div>
            <div className="payment-details">
                    <h3>Payment Details</h3>
                    <p><strong>Total Price: </strong>${totalPrice.toFixed(2)}</p>
                    {isPremiumUser && <p>Premium member: Booking fee waived!</p>}
                    {!isGuest && (
                        <div>
                            <label>
                                Use Reward Points (10 points = $1):
                                <input type="checkbox" checked={useRewards} onChange={handleUseRewardsToggle} />
                            </label>
                            {useRewards && (
                                <p>
                                    {priceAfterPoints > 0
                                        ? `Price After Points: $${priceAfterPoints.toFixed(2)} (You will use ${rewardPoints - remainingPoints} points)`
                                        : `Your points cover the full price! You'll have ${remainingPoints} points left.`}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            {/* {isGuest ? (
                <div>
                    <label>
                        Email:
                        <input type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} />
                    </label>
                    <label>
                        Phone Number:
                        <input type="tel" value={guestPhoneNumber} onChange={(e) => setGuestPhoneNumber(e.target.value)} />
                    </label>
                </div>
            ) : priceAfterPoints > 0 && (
                <div className="payment-method">
                    <label>
                        Payment Method:
                        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                            <option value="">Select Payment Method</option>
                            <option value="card">Card</option>
                            <option value="onlineBanking">Online Banking</option>
                        </select>
                    </label>
                </div>
            )} */}
             {isGuest ? (
        // Guest user input fields
        <div>
                    <label>
                        Email:
                        <input type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} />
                    </label>
                    <label>
                        Phone Number:
                        <input type="tel" value={guestPhoneNumber} onChange={(e) => setGuestPhoneNumber(e.target.value)} />
                    </label>
                </div>
    ) : priceAfterPoints > 0 && (
        <div className="payment-method">
            <label>
                Payment Method:
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                    <option value="">Select Payment Method</option>
                    <option value="card">Card</option>
                    <option value="onlineBanking">Online Banking</option>
                </select>
            </label>

            {paymentMethod === 'card' && (
                <>
                    <input type="text" placeholder="Card Number" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
                    <input type="text" placeholder="Expiry Date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
                    <input type="text" placeholder="CVV" value={cvv} onChange={(e) => setCvv(e.target.value)} />
                </>
            )}

            {paymentMethod === 'onlineBanking' && (
                <>
                    <input type="text" placeholder="Username" value={bankUsername} onChange={(e) => setBankUsername(e.target.value)} />
                    <input type="password" placeholder="Password" value={bankPassword} onChange={(e) => setBankPassword(e.target.value)} />
                </>
            )}
        </div>
    )}
            <button onClick={handlePayment} className="confirm-payment-btn">
                Confirm Payment
            </button>
        </div>
    );
    
};

export default Checkout;
