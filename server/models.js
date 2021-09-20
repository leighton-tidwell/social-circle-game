const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  gameid: {
    type: String,
    required: true,
  },
  socketid: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  age: {
    type: String,
    required: true,
  },
  relationshipStatus: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    required: true,
  },
  host: {
    type: Boolean,
    default: false,
  },
  blocked: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
