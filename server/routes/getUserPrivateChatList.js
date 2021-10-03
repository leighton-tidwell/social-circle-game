import { privateChatModel } from '../models';

const getUserPrivateChatList = async (req, res) => {
  const { gameid, socketid } = req.body;
  try {
    const listOfChats = await privateChatModel.find({ gameid: gameid });
    const userChats = listOfChats.filter((chat) =>
      chat.participants.includes(socketid)
    );
    res.json({ userChats });
  } catch (error) {
    console.log('Error in getting private chat list for user: ', error);
    res.sendStatus(500);
  }
};

export default getUserPrivateChatList;
