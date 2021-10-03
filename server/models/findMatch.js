import mongoose from 'mongoose';

const FindMatchSchema = new mongoose.Schema({
  socketid: {
    type: String,
    required: true,
  },
});

const FindMatch = mongoose.model('FindMatch', FindMatchSchema);

export default FindMatch;
