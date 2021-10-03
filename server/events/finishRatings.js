import { ratingsModel, userModel } from '../models';
import ShortUniqueId from 'short-unique-id';
import Promise from 'bluebird';

export default function finishRatings(io, socket) {
  return async ({ gameid, ratingCount }) => {
    try {
      const { MAX_RATINGS } = process.env;
      const getRatings = await ratingsModel.find({
        gameid: gameid,
        ratingCount: ratingCount,
      });
      if (!getRatings?.length) throw new Error('No ratings found');

      const listOfRatings = getRatings.map((user) => user.rating);
      let ratedScores = [];
      listOfRatings.forEach((listedRating) =>
        listedRating.forEach((rating) => {
          const index = ratedScores.findIndex((r) => {
            return r.socketid === rating.socketid;
          });

          if (index === -1) {
            ratedScores.push({
              socketid: rating.socketid,
              rating: rating.rating,
            });
          } else {
            ratedScores[index] = {
              ...ratedScores[index],
              rating: ratedScores[index].rating + rating.rating,
            };
          }
        })
      );

      const sortedScores = ratedScores.sort((a, b) =>
        a.rating > b.rating ? 1 : -1
      );

      const updatedPlayerList = await Promise.map(
        sortedScores,
        async (rating) => {
          const individualPlayer = await userModel
            .findOne({
              socketid: rating.socketid,
            })
            .exec();
          const ratedPlayer = {
            name: individualPlayer.name,
            profilePicture: individualPlayer.profilePicture,
            socketid: individualPlayer.socketid,
            rating: rating.rating,
          };
          return ratedPlayer;
        }
      );

      io.to(gameid).emit('ratings-calculated', updatedPlayerList);

      if (ratingCount === +MAX_RATINGS - 1) {
        io.to(gameid).emit('next-rating-last');
      }

      if (ratingCount >= +MAX_RATINGS || updatedPlayerList.length <= 3) {
        io.to(gameid).emit('game-over', {
          winnerOne: updatedPlayerList[0].name,
          winnerTwo: updatedPlayerList[1].name,
        });
        return;
      }

      const uuid = new ShortUniqueId({ length: 10 });
      const influencerChat = uuid();

      ratedScores.map((rating, i) => {
        if (i === 0 || i === 1) {
          const playerSocket = io.sockets.sockets.get(rating.socketid);
          playerSocket.emit('block-player-modal', {
            influencerChat,
            winnerOne: updatedPlayerList[0].socketid,
            winnerTwo: updatedPlayerList[1].socketid,
          });
          playerSocket.join(influencerChat);
        }
      });
    } catch (error) {
      console.log('Error in finish ratings: ', error);
    }
  };
}
