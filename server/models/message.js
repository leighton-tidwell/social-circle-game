import mongoose from 'mongoose';

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

export default Message;
