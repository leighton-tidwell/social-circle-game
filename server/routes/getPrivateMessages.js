import { privateMessageModel } from '../models';

const getPrivateMessages = async (req, res) => {
  const { chatid } = req.body;
  try {
    const listOfMessages = await privateMessageModel.find({ chatid: chatid });
    res.json({ listOfMessages });
  } catch (error) {
    console.log('Error in getting private messages: ', error);
    res.sendStatus(500);
  }
};

export default getPrivateMessages;
