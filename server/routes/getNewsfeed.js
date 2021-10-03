import { newsFeedModel } from '../models';

const getNewsfeed = async (req, res) => {
  const { gameid } = req.body;
  try {
    const newsFeed = await newsFeedModel.find({ gameid: gameid });
    res.json({ newsFeed });
  } catch (error) {
    console.log('Error in getting newsfeed: ', error);
    res.sendStatus(500);
  }
};

export default getNewsfeed;
