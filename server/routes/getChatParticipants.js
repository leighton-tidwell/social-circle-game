import { privateChatModel } from '../models';

const getChatParticipants = async (req, res) => {
  const { gameid, chatid } = req.body;
  try {
    const listOfParticipants = await privateChatModel.find({
      gameid: gameid,
      chatid: chatid,
    });

    if (!listOfParticipants?.length)
      throw new Error(`no participants found for chat ${chatid}.`);

    return res.json({ listOfParticipants });
  } catch (error) {
    console.log('Error in getting chat participants: ', error);
    res.sendStatus(500);
  }
};

export default getChatParticipants;
