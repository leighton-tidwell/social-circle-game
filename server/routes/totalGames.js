import { gameModel } from '../models';

const getTotalGames = async (req, res) => {
  try {
    const totalGames = await gameModel.find();
    res.json({ totalGames: totalGames.length });
  } catch (error) {
    console.log('Error in getting total games: ', error);
    res.sendStatus(500);
  }
};

export default getTotalGames;
