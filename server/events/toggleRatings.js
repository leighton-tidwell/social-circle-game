export default function toggleRatings(io, socket) {
  return ({ value, gameid }) => {
    io.to(gameid).emit('toggle-ratings', value);
  };
}
