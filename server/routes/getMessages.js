import { messageModel } from '../models';

const getMessages = async (req, res) => {
  const { gameid } = req.body;
  try {
    const listOfMessages = await messageModel.find({ gameid: gameid });
    res.json({ listOfMessages });
  } catch (error) {
    console.log('Error in getting messages: ', error);
    res.sendStatus(500);
  }
};

export default getMessages;
