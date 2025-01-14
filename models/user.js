const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  artist: {
    type: String,
    required: true,
  },
  album: {
    type: String,
    required: true,
  },
  format: {
    type: String,
    required: true,
    enum: ['LP', '7 inch'],
  },
  rating: {
    type: String,
    required: false,
    enum: ['*', '**', '***', '****', '*****'],
  },
  review: {
    type: String,
    required: false,
    default: '',
  },
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  recordCollection: [recordSchema],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
