const express = require('express');
const router = express.Router();
const authenticateJWT = require('./authMiddleware');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { Pool } = require('pg');

const db = new Pool({
  connectionString: 'postgresql://root:9046charan@codeheist-202.clhozppsctjn.us-east-2.rds.amazonaws.com:5432/movieBookingDB',
  ssl: {
    rejectUnauthorized: false // This allows self-signed certificates
  }
});

// Fetching user bookings
router.get('/bookings',authenticateJWT, async (req, res) => {
     const userId = req.user.user_id;

  try {
    const bookings = await db.query('SELECT * FROM bookings WHERE user_id = $1', [userId]);
    console.log('backend data')
    console.log(bookings);
    res.json(bookings.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Fetching user reward points
router.get('/rewards', authenticateJWT,  async (req, res) => {
   const userId = req.user.user_id;

  try {
    const rewards = await db.query('SELECT rewards_points FROM users WHERE user_id = $1', [userId]);
    res.json(rewards.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Fetching movies watched in the past 30 days
router.get('/watched-movies',authenticateJWT, async (req, res) => {
    const userId = req.user.user_id;

  try {
    // You will need to adjust this query based on your database structure
    const movies = await db.query('SELECT * FROM movies');
    res.json(movies.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Fetch all bookings for a specific user with seat numbers
router.get('/:user_id/tickets', async (req, res) => {
  try {
      const { user_id } = req.params;
      const query = `
          SELECT b.booking_id, b.number_of_tickets, b.total_price, b.booking_date,
                 m.title AS movie_title, s.showtime, t.name AS theater_name,
                 bs.seat_number
          FROM bookings b
          JOIN schedules s ON b.schedule_id = s.schedule_id
          JOIN movies m ON s.movie_id = m.movie_id
          JOIN theaters t ON s.theater_id = t.theater_id
          LEFT JOIN booked_seats bs ON b.booking_id = bs.booking_id
          WHERE b.user_id = $1
          ORDER BY b.booking_date DESC, bs.seat_number;
      `;
      const { rows } = await db.query(query, [user_id]);
      res.json(rows);
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
  }
});


// Endpoint to get reward points for a user
router.get('/:user_id/rewards', async (req, res) => {
  try {
    const { user_id } = req.params;
    const query = `SELECT rewards_points FROM users WHERE user_id = $1`;
    const { rows } = await db.query(query, [user_id]);
    if (rows.length > 0) {
      res.json({ rewards_points: rows[0].rewards_points });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to get reward points for a user
router.get('/:user_id/premiumcheck', async (req, res) => {
  try {
    const { user_id } = req.params;
    console.log('user id', user_id);
    const query = `SELECT membership_type FROM users WHERE user_id = $1`;
    const { rows } = await db.query(query, [user_id]);
    if (rows.length > 0) {
      const isPremium = rows[0].membership_type === 'Premium' || rows[0].membership_type === 'premium';
      res.json({
        isPremium: isPremium
      });
      console.log('premium user ', isPremium);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});



module.exports = router;
