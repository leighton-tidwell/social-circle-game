import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  gameid: {
    type: String,
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

export default User;
