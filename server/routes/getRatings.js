import { ratingsModel } from '../models';

const getRatings = async (req, res) => {
  const { gameid, ratingCount } = req.body;
  try {
    const listOfRatings = await ratingsModel.find({
      gameid: gameid,
      ratingCount: ratingCount,
    });

    res.json({ listOfRatings });
  } catch (error) {
    console.log('Error in getting rating information: ', error);
    res.sendStatus(500);
  }
};

export default getRatings;
