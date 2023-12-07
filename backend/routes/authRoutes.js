const express = require('express');
const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

console.log(process.env.SECRET_KEY);
const secretKey = process.env.SECRET_KEY;

const saltRounds = 10;

const { Pool } = require('pg');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const pool = new Pool({
  connectionString: 'postgresql://root:9046charan@codeheist-202.clhozppsctjn.us-east-2.rds.amazonaws.com:5432/movieBookingDB',
  ssl: {
    rejectUnauthorized: false // This allows self-signed certificates
  }
});

router.post('/register', async (req, res) => {
    try {

        console.log('request recevied charann')

        const { first_name, last_name, email, password, role, membership_type } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Save the user in the database
        const result = await pool.query('INSERT INTO users (first_name, last_name, email, password, role, membership_type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING user_id', [first_name, last_name, email, hashedPassword, role, membership_type]);

        // Return the user ID as a response
        res.status(201).json({ user_id: result.rows[0].user_id });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});


router.post('/login', async (req, res) => {
    try {
        console.log('request login charann')
        console.log("Secret Key:", secretKey);
        const { email, password } = req.body;

        // Retrieve the user from the database using the provided email
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (!user.rows.length) {
            return res.status(401).send('Invalid email or password.');
        }
        
        console.log('entered password is', password);
        console.log('password is', user.rows[0].password);
        const validPassword = await bcrypt.compare(password, user.rows[0].password);

        if (!validPassword) {
            return res.status(401).send('Invalid email or password.');
        }

        // If the password is valid, generate a JWT token
        const token = jwt.sign(
            {
                user_id: user.rows[0].user_id,
                role: user.rows[0].role
            },
            secretKey,  // This should be a secret string stored securely
            {
                expiresIn: '1h'  // Token expiration time
            }
        );

        res.json({
                        token,
                        user: {
                            user_id: user.rows[0].user_id,
                        role: user.rows[0].role
                    }
                });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
