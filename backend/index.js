const express = require('express');
const app = express();
const port = 5001;
const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/memberRoutes');
app.use('/auth', authRoutes);
app.use('/api/user', userRoutes);
const theaterMovieRoutes = require('./routes/theaterMovieRoutes');
app.use('/api', theaterMovieRoutes);
const adminMovieRoutes = require('./routes/adminMovieRoutes');
app.use('/admin', adminMovieRoutes);


const { Pool } = require('pg');
const bcrypt = require("bcrypt");

const pool = new Pool({
  connectionString: 'postgresql://charan:9046@127.0.0.1/movieBookingDB'
});


app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// test API
app.get('/api/backend-data', (req, res) => {
  const backendData = ['Data 1', 'Data 2', 'Data 3'];
  res.json(backendData);
});




app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
