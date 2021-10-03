import mongoose from 'mongoose';

const BlockSchema = new mongoose.Schema({
  influencerChatId: {
    type: String,
    required: true,
  },
  blocks: {
    type: Array,
    required: true,
  },
});

const Blocks = mongoose.model('Blocks', BlockSchema);

export default Blocks;
