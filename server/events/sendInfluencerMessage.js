export default function sendInfluencerMessage(io, socket) {
  return ({ influencerChatId, name, message }) => {
    io.to(influencerChatId).emit('influencer-chat', {
      name,
      message,
    });
  };
}
