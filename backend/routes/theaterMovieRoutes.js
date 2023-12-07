const { DoorBack } = require('@mui/icons-material');
const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const pool = new Pool({
  connectionString: 'postgresql://root:9046charan@codeheist-202.clhozppsctjn.us-east-2.rds.amazonaws.com:5432/movieBookingDB',
  ssl: {
    rejectUnauthorized: false // This allows self-signed certificates
  }
});

//Fecth all regions of theaters
router.get('/regions', async (req, res) => {
    try {
        const query = `select distinct region from theaters`;
        const { rows } = await pool.query(query);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

    
});

// Fetch all movies for a selected region
router.get('/regions/:region_id/movies', async (req, res) => {
    try {
      const { region_id } = req.params;
      const query = `
        SELECT DISTINCT m.*
        FROM movies m
        JOIN schedules s ON m.movie_id = s.movie_id
        JOIN theaters t ON s.theater_id = t.theater_id
        WHERE t.region = $1;
      `;
      const { rows } = await pool.query(query, [region_id]);
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


  // Fetch all theaters for a selected movie in a specific region
router.get('/movies/:movie_id/theaters', async (req, res) => {
    try {
      const { movie_id } = req.params;
      const { region_id } = req.query; // Passed as a query parameter
      const query = `
        SELECT DISTINCT t.*, s.showtime, s.schedule_id
        FROM theaters t
        JOIN schedules s ON t.theater_id = s.theater_id
        JOIN movies m ON s.movie_id = m.movie_id
        WHERE m.movie_id = $1 AND t.region = $2;
      `;
      const { rows } = await pool.query(query, [movie_id, region_id]);
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

// Add this new endpoint to get theaters by region
router.get('/regions/:region_id/theaters', async (req, res) => {
    try {
        const { region_id } = req.params;
        const query = `
            SELECT * FROM theaters
            WHERE region_id = $1;
        `;
        const { rows } = await pool.query(query, [region_id]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Fetch all theaters
router.get('/theaters', async (req, res) => {
    try {
        console.log('Backend recived query for theater');
        const query = `SELECT * FROM theaters`;
        const { rows } = await pool.query(query);
        console.log('theater rows fetched',rows);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Fetch all current movies with schedules for a selected theater
router.get('/theaters/:theater_id/current-movies', async (req, res) => {
    try {
        const { theater_id } = req.params;
        const query = `
            SELECT m.title, s.schedule_id, s.showtime
            FROM movies m
            JOIN schedules s ON m.movie_id = s.movie_id
            WHERE mt.theater_id = $1
            ORDER BY s.showtime;
        `;
        const { rows } = await pool.query(query, [theater_id]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Fetch all upcoming movies for a selected theater
router.get('/theaters/:theater_id/upcoming-movies', async (req, res) => {
    try {
        const { theater_id } = req.params;
        const query = `
            SELECT m.title, s.schedule_id, s.showtime
            FROM movies m
            JOIN schedules s ON m.movie_id = s.movie_id
            WHERE s.theater_id = $1 AND m.release_date > CURRENT_DATE
            ORDER BY m.release_date;
        `;
        const { rows } = await pool.query(query, [theater_id]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/seats/booked', async (req, res) => {
    try {
        const { schedule_id } = req.query;
        if (!schedule_id) {
            return res.status(400).json({ error: 'Schedule ID is required' });
        }

        const query = `
            SELECT bs.seat_number
            FROM booked_seats bs
            JOIN bookings b ON bs.booking_id = b.booking_id
            WHERE b.schedule_id = $1;
        `;

        const { rows } = await pool.query(query, [schedule_id]);
        const bookedSeats = rows.map(row => row.seat_number);

        res.json(bookedSeats);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/bookings', async (req, res) => {
  const client = await pool.connect();
  try {
      await client.query('BEGIN');
      const { user_id, schedule_id, selected_seats, use_rewards } = req.body;

      // Get the price per ticket and user's current rewards
      const scheduleQuery = 'SELECT price FROM schedules WHERE schedule_id = $1';
      const userRewardsQuery = 'SELECT rewards_points, membership_type FROM users WHERE user_id = $1';

      const scheduleResult = await client.query(scheduleQuery, [schedule_id]);
      const userResult = await client.query(userRewardsQuery, [user_id]);

      if (scheduleResult.rowCount === 0 || userResult.rowCount === 0) {
          throw new Error('Schedule or user not found');
      }

      const pricePerTicket = scheduleResult.rows[0].price;
      const userRewards = userResult.rows[0].rewards_points;
      const isPremium = userResult.rows[0].membership_type === 'Premium';

      // Calculate total price based on whether the user is a premium member
      const serviceFee = isPremium ? 0 : 1.5;
      let totalPrice = pricePerTicket * selected_seats.length + serviceFee * selected_seats.length;

      // Calculate the price after applying reward points if applicable
      let rewardPointsUsed = 0;
      if (use_rewards && userRewards > 0) {
          const pointsAsDollars = userRewards / 10;
          totalPrice = Math.max(totalPrice - pointsAsDollars, 0).toFixed(2);
          rewardPointsUsed = Math.min(userRewards, pointsAsDollars * 10);
      }

      // Insert the booking
      const bookingQuery = `
          INSERT INTO bookings (user_id, schedule_id, number_of_tickets, total_price, booking_date)
          VALUES ($1, $2, $3, $4, CURRENT_DATE)
          RETURNING booking_id;
      `;
      const bookingResult = await client.query(bookingQuery, [user_id, schedule_id, selected_seats.length, totalPrice]);
      const bookingId = bookingResult.rows[0].booking_id;

      // Inserting into booked_seats table
      const seatInsertQuery = 'INSERT INTO booked_seats (booking_id, seat_number) VALUES ($1, $2)';
      for (const seat of selected_seats) {
          await client.query(seatInsertQuery, [bookingId, seat]);
      }

      // Update the user's reward points
      let newRewardPoints = userRewards - rewardPointsUsed;
       newRewardPoints += Math.round(totalPrice);

      const updateRewardsQuery = 'UPDATE users SET rewards_points = $1 WHERE user_id = $2';
      await client.query(updateRewardsQuery, [newRewardPoints, user_id]);

      await client.query('COMMIT');
      res.json({ message: "Booking successful", bookingId, rewardPoints: newRewardPoints });
  } catch (err) {
      await client.query('ROLLBACK');
      console.error('Error during booking transaction:', err);
      res.status(500).json({ error: err.message });
  } finally {
      client.release();
  }
});


router.post('/tickets/:bookingId/cancel', async (req, res) => {
    const { bookingId } = req.params;
    const { cancellationReason, refundOption, seatNumber } = req.body;
    const client = await pool.connect();
  
    try {
      await client.query('BEGIN');
  
      // Fetch booking details
      const bookingQuery = 'SELECT * FROM bookings WHERE booking_id = $1';
      const bookingResult = await client.query(bookingQuery, [bookingId]);
      const booking = bookingResult.rows[0];
      
  
      if (!booking) {
        throw new Error('Booking not found');
      }

    const scheduleQuery = 'SELECT price FROM schedules WHERE schedule_id = $1';
    const scheduleResult = await client.query(scheduleQuery, [booking.schedule_id]);
    const pricePerTicket = scheduleResult.rows[0].price;
  
      // Check if more than one ticket in the booking
      if (booking.number_of_tickets > 1) {
        // Calculate new total price based on reduced number of tickets

        const newTotalPrice = (booking.number_of_tickets - 1) * pricePerTicket;

        // Remove the specific seat from booked_seats
        const deleteSeatQuery = 'DELETE FROM booked_seats WHERE booking_id = $1 AND seat_number = $2';
        await client.query(deleteSeatQuery, [bookingId, seatNumber]);
  
        // Update booking in the DB
        const updateBookingQuery = 'UPDATE bookings SET number_of_tickets = number_of_tickets - 1, total_price = $1 WHERE booking_id = $2';
        await client.query(updateBookingQuery, [newTotalPrice, bookingId]);  
      } else {
        // Delete the booking and remove the seat from booked_seats

        const deleteSeatQuery = 'DELETE FROM booked_seats WHERE booking_id = $1 AND seat_number = $2';
        await client.query(deleteSeatQuery, [bookingId, seatNumber]); 

        const deleteBookingQuery = 'DELETE FROM bookings WHERE booking_id = $1';
        await client.query(deleteBookingQuery, [bookingId]);

        
      }
  
      // Update audit table with cancellationReason
      // Assuming an 'audit' table exists
      const auditQuery = 'INSERT INTO audit (booking_id, cancellation_reason) VALUES ($1, $2)';
      await client.query(auditQuery, [bookingId, cancellationReason]);

      console.log('refund option is ', refundOption, refundOption === 'points', pricePerTicket);
      // Handle refund or points adjustment
      if (refundOption === 'points') {
        // Increase user's reward points
        // Assuming $1 spent equals 1 reward point
        const rewardsPoints = Math.round(pricePerTicket * 10) ;
        const updateRewardsQuery = 'UPDATE users SET rewards_points = rewards_points + $1 WHERE user_id = $2';
        await client.query(updateRewardsQuery, [rewardsPoints, booking.user_id]);
      } else {
        // Process refund (if applicable)
        // Implement refund logic here
      }
  
      await client.query('COMMIT');
      res.json({ message: "Cancellation successful" });
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Error during cancellation transaction:', err);
      res.status(500).json({ error: err.message });
    } finally {
      client.release();
    }
  });

  // Fetch show details by schedule ID
router.get('/show/selected', async (req, res) => {
  const { schedule_id } = req.query;

  if (!schedule_id) {
      return res.status(400).json({ error: 'Schedule ID is required' });
  }

  try {
      const query = `
          SELECT s.schedule_id, m.title, t.name as theater_name, s.showtime, s.price, t.seating_capacity
          FROM schedules s
          JOIN movies m ON s.movie_id = m.movie_id
          JOIN theaters t ON s.theater_id = t.theater_id
          WHERE s.schedule_id = $1;
      `;
      const { rows } = await pool.query(query, [schedule_id]);
      if (rows.length === 0) {
          return res.status(404).json({ error: 'Show details not found' });
      }
      res.json(rows[0]);
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/guestbookings', async (req, res) => {
  const client = await pool.connect();
  try {
      await client.query('BEGIN');
      const { schedule_id, selected_seats } = req.body;

      // Use a dummy user_id for guest bookings
      const guestUserId = 9999; // Example dummy user ID

      // Get the price per ticket
      const scheduleQuery = 'SELECT price FROM schedules WHERE schedule_id = $1';
      const scheduleResult = await client.query(scheduleQuery, [schedule_id]);
      if (scheduleResult.rowCount === 0) {
          throw new Error('Schedule not found');
      }

      const pricePerTicket = scheduleResult.rows[0].price;

      // Calculate total price (assuming no service fee for guest users)
      const totalPrice = pricePerTicket * selected_seats.length;

      // Insert the booking
      const bookingQuery = `
          INSERT INTO bookings (user_id, schedule_id, number_of_tickets, total_price, booking_date)
          VALUES ($1, $2, $3, $4, CURRENT_DATE)
          RETURNING booking_id;
      `;
      const bookingResult = await client.query(bookingQuery, [guestUserId, schedule_id, selected_seats.length, totalPrice]);
      const bookingId = bookingResult.rows[0].booking_id;

      // Inserting into booked_seats table
      const seatInsertQuery = 'INSERT INTO booked_seats (booking_id, seat_number) VALUES ($1, $2)';
      for (const seat of selected_seats) {
          await client.query(seatInsertQuery, [bookingId, seat]);
      }

      await client.query('COMMIT');
      res.json({ message: "Guest booking successful", bookingId });
  } catch (err) {
      await client.query('ROLLBACK');
      console.error('Error during guest booking transaction:', err);
      res.status(500).json({ error: err.message });
  } finally {
      client.release();
  }
});



module.exports = router;
