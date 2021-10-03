import { findMatchModel } from '../models/';

export default function stopFindMatch(io, socket) {
  return async () => {
    try {
      const { MAX_PLAYERS } = process.env;
      console.log(
        `FIND MATCH: ${socket.id} is requesting to stop finding a match.`
      );
      socket.leave('FIND_MATCH');
      socket.join('IDLE_ROOM');

      await findMatchModel.deleteOne({ socketid: socket.id });

      const clientsFindingMatch = io.sockets.adapter.rooms.get('FIND_MATCH');
      if (!clientsFindingMatch?.size) return; // no players in find match
      io.to('FIND_MATCH').emit('update-finding-match-count', {
        playersSearching: clientsFindingMatch.size,
        playersRequired: MAX_PLAYERS,
      });
    } catch (error) {
      console.log('Error in stop finding match: ', error);
    }
  };
}
