const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User model
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, 'Invalid email format'],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
});

// Password hashing before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10); // Salt rounds
  }
  next();
});
// Compare password method
userSchema.methods.matchPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};
module.exports = mongoose.model('User', userSchema);
