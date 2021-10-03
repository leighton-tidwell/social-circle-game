import { privateChatModel } from '../models';

const getPrivateChatList = async (req, res) => {
  const { gameid } = req.body;
  try {
    const listOfChats = await privateChatModel.find({ gameid: gameid });
    res.json({ listOfChats });
  } catch (error) {
    console.log('Error in getting private chat list: ', error);
    res.sendStatus(500);
  }
};

export default getPrivateChatList;
