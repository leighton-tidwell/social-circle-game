import { userModel } from '../models';

const listPlayers = async (req, res) => {
  const { gameid } = req.body;
  try {
    const playerList = await userModel.find({
      gameid: gameid,
      host: false,
      blocked: false,
    });

    if (!playerList?.length)
      throw new Error(`empty player list for game ${gameid}.`);

    res.json({ playerList });
  } catch (error) {
    console.log('Error in listing players: ', error);
    res.sendStatus(500);
  }
};

export default listPlayers;
