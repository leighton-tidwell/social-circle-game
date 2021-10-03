import mongoose from 'mongoose';

const NewsFeedSchema = new mongoose.Schema({
  gameid: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const NewsFeed = mongoose.model('NewsFeed', NewsFeedSchema);

export default NewsFeed;
