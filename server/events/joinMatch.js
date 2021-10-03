export default function joinMatch(io, socket) {
  return (room) => {
    console.log(
      `JOIN MATCH: ${socket.id} is requesting to join match ${room}.`
    );

    const { MAX_PLAYERS } = process.env;
    const totalPlayers = io.sockets.adapter.rooms.get(room);
    if (!totalPlayers?.size) return; // room doesn't exist

    if (totalPlayers !== +MAX_PLAYERS) {
      socket.leave('IDLE_ROOM');
      socket.join(room);
      socket.emit('join-match', room);
      io.to(room).emit('player-joined', {
        totalPlayers: totalPlayers + 1,
        maxPlayers: MAX_PLAYERS,
      });
      return;
    }

    socket.emit('failed-join', { reason: 'full' });
  };
}
