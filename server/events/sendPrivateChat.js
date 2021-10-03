import { userModel, privateMessageModel } from '../models/';

export default function sendPrivateChat(io, socket) {
  return async (newMessage) => {
    try {
      const user = await userModel.findOne({ socketid: socket.id });
      if (!user) throw new Error('User not found');

      const saveMessage = {
        ...newMessage,
        avatar: user.profilePicture,
      };

      const message = new privateMessageModel(saveMessage);
      await message.save();
      io.to(newMessage.chatid).emit('new-private-message', saveMessage);
    } catch (error) {
      console.log('Error in send private chat: ', error);
    }
  };
}
