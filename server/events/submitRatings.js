import { ratingsModel } from '../models';

export default function submitRatings(io, socket) {
  return async ({ gameid, player, ratings, ratingCount }) => {
    try {
      const newRating = {
        gameid,
        socketid: player,
        rating: ratings,
        ratingCount,
      };

      const saveRating = new ratingsModel(newRating);
      await saveRating.save();

      io.to(gameid).emit('rating-submitted');
    } catch (error) {
      console.log('Error in submit ratings: ', error);
    }
  };
}
