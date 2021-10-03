import { userModel } from '../models';

const getTotalPlayers = async (req, res) => {
  try {
    const totalPlayers = await userModel.find().distinct('socketid');
    res.json({ totalPlayers: totalPlayers.length });
  } catch (error) {
    console.log('Error in getting total players: ', error);
    res.sendStatus(500);
  }
};

export default getTotalPlayers;
