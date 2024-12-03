const User = require('../models/user');
const Role = require('../models/role');

const getUsers = async (req, res) => {
  try {
    const users = await User.find().populate('role');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createUser = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    const roleFound = await Role.findOne({ name: role });
    if (!roleFound) return res.status(400).json({ message: 'Role not found' });

    const user = new User({ username, email, password, role: roleFound._id });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getUsers, createUser };
