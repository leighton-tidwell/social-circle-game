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
  },
  age: {
    type: String,
  },
  relationshipStatus: {
    type: String,
  },
  bio: {
    type: String,
  },
  profilePicture: {
    type: String,
  },
  host: {
    type: Boolean,
    default: false,
  },
  blocked: {
    type: Boolean,
    default: false,
  },
  disconnected: {
    type: Boolean,
    defaul: false,
  },
});

const User = mongoose.model('User', UserSchema);

const MessageSchema = new mongoose.Schema({
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
  avatar: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = { userModel: User, messageModel: Message };
