export default function stopHostedMatch(io, socket) {
  return async ({ gameid, hostid }) => {
    const clientsInHostedLobby = io.sockets.adapter.rooms.get(gameid);
    if (!clientsInHostedLobby?.size) return; // room doesnt exist anymore

    for (const clientId of clientsInHostedLobby) {
      const clientSocket = io.sockets.sockets.get(clientId);

      if (clientId !== hostid) clientSocket.emit('stop-hosted-match');
      clientSocket.leave(gameid);
    }
  };
}
