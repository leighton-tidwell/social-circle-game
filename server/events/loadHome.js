import { userModel } from '../models/';

export default function loadHome(io, socket) {
  return async (gameid) => {
    try {
      const players = await userModel.find({ gameid: gameid });
      socket.emit('load-home', players);
    } catch (error) {
      console.log('Error in load home: ', error);
    }
  };
}
