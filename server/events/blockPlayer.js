import { userModel, blockModel } from '../models';

export default function blockPlayer(io, socket) {
  return async (influencerChatId, lobbyId) => {
    try {
      const findBlocks = await blockModel.findOne({
        influencerChatId: influencerChatId,
      });
      if (!findBlocks) throw new Error('No blocks found');

      const blockedPlayers = findBlocks.blocks.map(
        (blockChoice) => blockChoice.block
      );

      const uniqueBlockedPlayers = new Set(blockedPlayers);

      if (blockedPlayers.length !== 2)
        return socket.emit(
          'block-error',
          'The other player has not selected a player to block.'
        );

      if (uniqueBlockedPlayers.size === blockedPlayers.length)
        return socket.emit(
          'block-error',
          'Both players must agree on who to block.'
        );

      io.to(influencerChatId).emit('successfully-blocked-player');
      const blockedSocket = io.sockets.sockets.get(blockedPlayers[0]);
      blockedSocket.emit('blocked');

      const blockedPlayer = await userModel.findOneAndUpdate(
        { socketid: blockedSocket.id },
        { blocked: true }
      );
      io.to(lobbyId).emit('blocked-player', blockedPlayer.name);
    } catch (error) {
      console.log('Error when blocking player: ', error);
    }
  };
}
