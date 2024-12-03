const express = require('express');
const { getUsers, createUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', protect, authorize('admin'), getUsers);
router.post('/', protect, authorize('admin'), createUser);

module.exports = router;
