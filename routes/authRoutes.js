const express = require('express');
const router = express.Router();
const { register, login, refreshToken } = require('../controllers/authController');

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

// Refresh token route
router.post('/refresh-token', refreshToken);

module.exports = router;
