import ShortUniqueId from 'short-unique-id';

export default function hostMatch(io, socket) {
  return () => {
    const hostuuid = new ShortUniqueId({
      length: 6,
      dictionary: 'alpha_upper',
    });
    const newLobby = hostuuid();
    console.log(
      `HOST MATCH: ${socket.id} is requesting to host match ${newLobby}.`
    );

    socket.emit('host-match', { lobby: newLobby });

    socket.leave('IDLE_ROOM');
    socket.join(newLobby);
  };
}
