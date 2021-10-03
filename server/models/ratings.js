import mongoose from 'mongoose';

const RatingsSchema = new mongoose.Schema({
  gameid: {
    type: String,
    required: true,
  },
  socketid: {
    type: String,
    required: true,
  },
  rating: {
    type: Array,
    required: true,
  },
  ratingCount: {
    type: Number,
    required: true,
  },
});

const Ratings = mongoose.model('Ratings', RatingsSchema);

export default Ratings;
