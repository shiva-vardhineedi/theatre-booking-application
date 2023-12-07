const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

function authenticateJWT(req, res, next) {
    const authHeader = req.headers.authorization;


   console.log('Authenticating...');
if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            console.error('Token verification error:', err);
            return res.sendStatus(403);
        }
        console.log('Decoded user:', user);
        req.user = user;
        next();
    });
} else {
    console.warn('No authorization header present');
    res.sendStatus(401);
}

}

module.exports = authenticateJWT;
