const jwt = require('jsonwebtoken');
const User = require('../models/user');
const RefreshToken = require('../models/refreshToken');

// Register
const register = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({ email, password, role });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const accessToken = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    // Save refresh token
    await RefreshToken.create({ token: refreshToken });

    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Refresh Token
const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  try {
    if (!refreshToken) {
      return res.status(403).json({ message: 'Refresh token required' });
    }

    const storedToken = await RefreshToken.findOne({ token: refreshToken });
    if (!storedToken) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const newAccessToken = jwt.sign({ userId: decoded.userId, role: decoded.role }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ message: 'Invalid refresh token', error: error.message });
  }
};

module.exports = { register, login, refreshToken };
