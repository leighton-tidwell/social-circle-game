import { userModel, findMatchModel } from '../models';

export default function disconnect(io, socket) {
  return async () => {
    try {
      const { MAX_PLAYERS } = process.env;

      console.log(`${socket.id} has disconnected.`);
      const playerData = await userModel.findOneAndUpdate(
        { socketid: socket.id },
        {
          disconnected: true,
          gameid: '',
          profilePicture: '',
          name: '',
          age: '',
          bio: '',
          relationshipStatus: '',
        }
      );

      if (playerData?.gameid) {
        const playerName = playerData.name || 'A player';
        const gameid = playerData.gameid;
        const isHost = playerData.host;
        if (isHost) {
          io.to(gameid).emit('host-disconnect');
          io.socketsLeave(gameid);
          await userModel.updateMany(
            { gameid: gameid },
            {
              gameid: '',
              profilePicture: '',
              name: '',
              age: '',
              bio: '',
              relationshipStatus: '',
            }
          );
          console.log('Host leave cleanup complete.');
        } else {
          io.to(gameid).emit('player-disconnected', {
            playerName,
          });
        }
        return;
      }

      const clientsFindingMatch = io.sockets.adapter.rooms.get('FIND_MATCH');
      await findMatchModel.deleteOne({ socketid: socket.id });
      if (!clientsFindingMatch?.size) return;

      io.to('FIND_MATCH').emit('update-finding-match-count', {
        playersSearching: clientsFindingMatch.size,
        playersRequired: MAX_PLAYERS,
      });
    } catch (error) {
      console.log('Error in disconnecting: ', error);
    }
  };
}
