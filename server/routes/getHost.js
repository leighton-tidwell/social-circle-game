import { userModel } from '../models';

const getHost = async (req, res) => {
  const { gameid } = req.body;
  try {
    const host = await userModel.find({ gameid: gameid, host: true });

    if (!host?.length) throw new Error(`no host found for ${gameid}.`);

    res.json({ host });
  } catch (error) {
    console.log('Error in getting host: ', error);
    res.sendStatus(500);
  }
};

export default getHost;
