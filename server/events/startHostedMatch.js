import { userModel, gameModel } from '../models';

export default function startHostedMatch(io, socket) {
  return async ({ gameid, hostid }) => {
    try {
      const clientsInHostedLobby = io.sockets.adapter.rooms.get(gameid);
      if (!clientsInHostedLobby?.size) throw new Error('no users in lobby');

      for (const clientId of clientsInHostedLobby) {
        const newUserData = {
          gameid,
          socketid: clientId,
          host: false,
        };

        if (clientId === hostid) {
          newUserData.host = true;
        }

        await userModel
          .findOneAndUpdate({ socketid: clientId }, newUserData, {
            upsert: true,
          })
          .exec();
      }

      const newGame = {
        gameid,
      };

      const saveGame = new gameModel(newGame);
      await saveGame.save();
      io.to(gameid).emit('start-game', {
        gameid: gameid,
        hostid: hostid,
      });
    } catch (error) {
      console.log('Error in starting hosted match: ', error);
    }
  };
}
