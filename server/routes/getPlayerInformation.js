import { userModel } from '../models';

const getPlayerInformation = async (req, res) => {
  const { socketid } = req.body;
  try {
    const playerData = await userModel.find({ socketid: socketid });

    if (!playerData?.length)
      throw new Error(`no player info found for chat ${socketid}.`);

    res.json({ playerData });
  } catch (error) {
    console.log('Error in getting user information: ', error);
    res.sendStatus(500);
  }
};

export default getPlayerInformation;
