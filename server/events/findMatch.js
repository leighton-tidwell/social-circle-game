import { userModel, gameModel, findMatchModel } from '../models';
import ShortUniqueId from 'short-unique-id';

export default function findMatch(io, socket) {
  return async () => {
    console.log(`FIND MATCH: ${socket.id} is requesting to find a match.`);
    socket.join('FIND_MATCH');
    socket.leave('IDLE_ROOM');

    const { MAX_PLAYERS } = process.env;

    try {
      const clientsFindingMatch = io.sockets.adapter.rooms.get('FIND_MATCH');
      if (!clientsFindingMatch?.size)
        throw new Error('Error in find match, cant get size of lobby');

      io.to('FIND_MATCH').emit('update-finding-match-count', {
        playersSearching: clientsFindingMatch.size,
        playersRequired: MAX_PLAYERS,
      });

      const newClientFindingMatch = {
        socketid: socket.id,
      };
      const saveClientFindingMatch = new findMatchModel(newClientFindingMatch);
      await saveClientFindingMatch.save();

      if (clientsFindingMatch.size !== +MAX_PLAYERS) return;

      const uuid = new ShortUniqueId({ length: 10 });
      const newLobby = uuid();

      console.log(`Lobby ID: ${newLobby} has just started!`);

      const hostIndex = Math.floor(
        Math.random() * (clientsFindingMatch.size - 0) + 0
      );

      let i = 0;
      let hostSocketId = '';
      for (const clientId of clientsFindingMatch) {
        const clientSocket = io.sockets.sockets.get(clientId);
        clientSocket.join(newLobby);
        clientSocket.leave('FIND_MATCH');

        const newUserData = {
          gameid: newLobby,
          socketid: clientId,
        };

        if (i === hostIndex) {
          newUserData.host = true;
          hostSocketId = clientSocket.id;
        }
        await userModel.findOneAndUpdate({ socketid: clientId }, newUserData);
        await findMatchModel.deleteOne({ socketid: clientId });
        i++;
      }

      const newGame = {
        gameid: newLobby,
      };
      const saveGame = new gameModel(newGame);
      await saveGame.save();

      io.to(newLobby).emit('start-game', {
        gameid: newLobby,
        hostid: hostSocketId,
      });
    } catch (error) {
      console.log('Error in find match: ', error);
    }
  };
}
