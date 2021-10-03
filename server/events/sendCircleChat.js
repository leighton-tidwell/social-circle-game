import { userModel, messageModel } from '../models/';

export default function sendCircleChat(io, socket) {
  return async (newMessage) => {
    try {
      const user = await userModel.findOne({ socketid: socket.id });
      if (!user) throw new Error(`User ${socket.id} not found.`);

      const saveMessage = {
        ...newMessage,
        avatar: user.profilePicture,
      };

      const message = new messageModel(saveMessage);
      await message.save();
      io.to(newMessage.gameid).emit('new-circle-message', saveMessage);
    } catch (error) {
      console.log('Error in send circle chat: ', error);
    }
  };
}
