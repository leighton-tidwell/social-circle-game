export default function playerLeftHostedMatch(io, socket) {
  return ({ gameid }) => {
    const { MAX_PLAYERS } = process.env;
    const totalPlayers = io.sockets.adapter.rooms.get(gameid);

    if (!totalPlayers?.size) return; // room doesn't exist

    socket.leave(gameid);
    socket.join('IDLE_ROOM');
    io.to(gameid).emit('player-joined', {
      totalPlayers: totalPlayers - 1,
      maxPlayers: MAX_PLAYERS,
    });
  };
}
