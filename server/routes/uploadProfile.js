import { userModel } from '../models';

const uploadProfile = async (req, res) => {
  const { user } = req.body;
  try {
    await userModel.findOneAndUpdate({ socketid: user.socketid }, user, {
      upsert: true,
    });
    res.sendStatus(200);
  } catch (error) {
    console.log('Error in upload profile picture: ', error);
    res.sendStatus(500);
  }
};

export default uploadProfile;
