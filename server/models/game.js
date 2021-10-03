import mongoose from 'mongoose';

const GameSchema = new mongoose.Schema({
  gameid: {
    type: String,
    required: true,
  },
});

const Game = mongoose.model('Game', GameSchema);

export default Game;
