import mongoose from 'mongoose';

const PrivateMessageSchema = new mongoose.Schema({
  chatid: {
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

const PrivateMessage = mongoose.model('PrivateMessage', PrivateMessageSchema);

export default PrivateMessage;
