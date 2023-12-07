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
router.get('/movies', async (req, res) => {
  try {
      const queryText = 'SELECT * FROM movies';
      const response = await pool.query(queryText);
      res.status(200).json(response.rows);
  } catch (error) {
      console.error('Error fetching movies:', error);
      res.status(500).send('Error fetching movies');
  }
});

router.post('/add-movie', async (req, res) => {
    const { title, description, duration, release_date ,posterurl} = req.body;
  
    try {
      const queryText = 'INSERT INTO movies (title, description, duration, release_date,posterurl) VALUES ($1, $2, $3, $4, $5) RETURNING *';
      const values = [title, description, duration, release_date, posterurl];
      console.log(values,"************");
      const response = await pool.query(queryText, values);
      res.status(201).json(response.rows[0]);
    } catch (error) {
      console.error('Error adding movie:', error);
      res.status(500).send('Error adding movie');
    }
  });
router.put('/update-movie/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, duration, release_date,posterurl } = req.body;

    try {
        const queryText = 'UPDATE movies SET title = $1, description = $2, duration = $3, release_date = $4, posterurl=$5 WHERE movie_id = $6 RETURNING *';
        const values = [title, description, duration, release_date, posterurl,id];
        const response = await pool.query(queryText, values);
        res.status(200).json(response.rows[0]);
    } catch (error) {
        res.status(500).send('Error updating movie');
    }
});
router.delete('/delete-movie/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // First, delete the referencing rows from 'showtime_assignments'
    const deleteShowtimeAssignmentsQuery = 'DELETE FROM schedules WHERE movie_id = $1 RETURNING *';
    const responseShowtimeAssignments = await pool.query(deleteShowtimeAssignmentsQuery, [id]);
    // Finally, attempt to delete the movie
    const deleteMovieQuery = 'DELETE FROM movies WHERE movie_id = $1 RETURNING *';
    const responseMovies = await pool.query(deleteMovieQuery, [id]);

    // Check if the movie was found and deleted
    if (responseMovies.rowCount === 0) {
      return res.status(404).send('Movie not found');
    }

    res.status(200).send(`Movie with ID ${id} deleted successfully`);
  } catch (error) {
    console.error('Error deleting movie:', error);
    res.status(500).send('Error deleting movie');
  }
});
router.get('/theaters', async (req, res) => {
  try {
      const queryText = 'SELECT * FROM theaters';
      const response = await pool.query(queryText);
      console.log(response,"Theaters");
      res.status(200).json(response.rows);
  } catch (error) {
      console.error('Error fetching theaters:', error);
      res.status(500).send('Error fetching theaters');
  }
});
router.post('/add-showtime', async (req, res) => {
  const { movie_id, theater_id, showtime } = req.body;
  try {
      const queryText = 'INSERT INTO schedules (movie_id, theater_id, showtime) VALUES ($1, $2, $3) RETURNING *';
      const values = [movie_id, theater_id, showtime];
      const response = await pool.query(queryText, values);

      res.status(201).json(response.rows[0]);
  } catch (error) {
      console.error('Error adding showtime assignment:', error);
      res.status(500).send('Error adding showtime assignment');
  }
});
// adminMovieRoutes.js
router.put('/update-theater-seating', async (req, res) => {
  const { name, seating_capacity } = req.body;

  try {
      if (!name || !seating_capacity) {
          return res.status(400).send('Theater name and new capacity are required');
      }

      const queryText = 'UPDATE theaters SET seating_capacity = $1 WHERE name = $2 RETURNING *';
      const result = await pool.query(queryText, [seating_capacity, name]);
      console.log("*******************");
      if (result.rowCount === 0) {
          return res.status(404).send('Theater not found');
      }

      res.status(200).json(result.rows[0]);
  } catch (error) {
      console.error('Error updating seating capacity:', error);
      res.status(500).send('Error updating seating capacity: ' + error.message);
  }
});
router.post('/apply-discounts', async (req, res) => {
  const { discountBeforeSix, tuesdayDiscount } = req.body;

  // Convert percentages to decimal multipliers for the discount application
  const beforeSixMultiplier = (100 - discountBeforeSix) / 100;
  const tuesdayMultiplier = (100 - tuesdayDiscount) / 100;

  try {
    const updateDiscountQuery = `
    UPDATE schedules
SET 
  price = CASE
      WHEN EXTRACT(ISODOW FROM showtime) = 2 THEN price * ${tuesdayMultiplier}
      WHEN EXTRACT(HOUR FROM showtime) < 18 AND EXTRACT(ISODOW FROM showtime) <> 2 THEN price * ${beforeSixMultiplier}
      ELSE price
  END,
  discount_price = CASE
      WHEN EXTRACT(ISODOW FROM showtime) = 2 THEN price - (price * ${tuesdayMultiplier})
      WHEN EXTRACT(HOUR FROM showtime) < 18 AND EXTRACT(ISODOW FROM showtime) <> 2 THEN price - (price * ${beforeSixMultiplier})
      ELSE 0
  END
WHERE EXTRACT(ISODOW FROM showtime) = 2 OR (EXTRACT(HOUR FROM showtime) < 18 AND EXTRACT(ISODOW FROM showtime) <> 2);
`;

await pool.query(updateDiscountQuery);
      res.status(200).send('Discount prices configured successfully.');


  } catch (error) {
      console.error('Error configuring discount prices:', error);
      res.status(500).send('Error configuring discount prices: ' + error.message);
  }
});
router.get('/theater-occupancy-by-location', async (req, res) => {
  const { period } = req.query;

  const query = `
  SELECT t.region,SUM(b.number_of_tickets) AS total_tickets
  FROM bookings b
  JOIN schedules sch ON sch.schedule_id = b.schedule_id
  JOIN theaters t ON t.theater_id = sch.theater_id
  WHERE b.booking_date >= CURRENT_DATE - $1::integer
  GROUP BY t.region
  ORDER BY total_tickets DESC;
  `;

  try {
    const result = await pool.query(query, [period]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching theater occupancy by location:', error);
    res.status(500).send('Server error');
  }
});
router.get('/theater-occupancy-by-movie', async (req, res) => {
  const { period } = req.query;

  const query = `
    SELECT m.title AS movie_title, t.name AS theater_name, SUM(b.number_of_tickets) AS total_tickets
    FROM bookings b
    JOIN schedules sch ON sch.schedule_id = b.schedule_id
    JOIN movies m ON m.movie_id = sch.movie_id
    JOIN theaters t ON t.theater_id = sch.theater_id
    WHERE b.booking_date >= CURRENT_DATE - $1::integer
    GROUP BY m.title, t.name
    ORDER BY total_tickets DESC;
  `;

  try {
    const result = await pool.query(query, [period]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching theater occupancy by movie:', error);
    res.status(500).send('Server error');
  }
});



  module.exports = router;