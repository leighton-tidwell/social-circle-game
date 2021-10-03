export default function toggleCircleChat(io, socket) {
  return ({ value, gameid }) => {
    io.to(gameid).emit('toggle-circle-chat', value);
  };
}
