import { newsFeedModel } from '../models/';

export default function newNewsfeed(io, socket) {
  return async (message) => {
    try {
      const saveMessage = new newsFeedModel(message);
      await saveMessage.save();
      io.to(message.gameid).emit('new-newsfeed');
    } catch (error) {
      console.log('Error in news feed: ', error);
    }
  };
}
