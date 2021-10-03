import mongoose from 'mongoose';

const PrivateChatSchema = new mongoose.Schema({
  gameid: {
    type: String,
    required: true,
  },
  chatid: {
    type: String,
    required: true,
  },
  chatname: {
    type: String,
  },
  participants: {
    type: Array,
    required: true,
  },
  participantNames: {
    type: Array,
    required: true,
  },
  closed: {
    type: Boolean,
    default: false,
  },
});

const PrivateChat = mongoose.model('PrivateChat', PrivateChatSchema);

export default PrivateChat;
