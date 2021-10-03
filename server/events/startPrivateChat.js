import ShortUniqueId from 'short-unique-id';
import Promise from 'bluebird';
import { userModel, privateChatModel } from '../models/';

export default function startPrivateChat(io, socket) {
  return async ({ gameid, socketid, player }) => {
    try {
      const uuid = new ShortUniqueId({ length: 10 });
      const newChatId = uuid();
      const participants = [socketid, player];

      // lets check to see if an existing private chat is here
      const listOfChats = await privateChatModel.find({ gameid: gameid });
      const foundChat = listOfChats.filter(
        (chat) =>
          chat.participants.includes(socketid) &&
          chat.participants.includes(player)
      );

      if (foundChat?.length) {
        const clientSocket = io.sockets.sockets.get(socketid);
        clientSocket.emit('go-to-chat', { chatid: foundChat[0].chatid });
        return;
      }

      const participantNames = await Promise.map(
        participants,
        async (participant) => {
          const user = await userModel
            .findOne({ socketid: participant })
            .exec();
          return user.name;
        }
      );

      const newChat = {
        gameid,
        chatid: newChatId,
        participants,
        participantNames,
      };
      const saveChat = new privateChatModel(newChat);
      await saveChat.save();

      participants.forEach((participant) => {
        const clientSocket = io.sockets.sockets.get(participant);
        clientSocket.join(newChatId);
        if (clientSocket.id !== socketid)
          clientSocket.emit('new-private-chat', {
            playerName: participantNames[0],
            chatid: newChatId,
          });
      });

      socket.emit('go-to-chat', { chatid: newChatId });

      const host = await userModel.findOne({ gameid: gameid, host: true });
      if (!host) throw new Error('Cant find host');

      const hostSocketId = host.socketid;
      const hostSocket = io.sockets.sockets.get(hostSocketId);
      hostSocket.join(newChatId);

      hostSocket.emit('host-new-private-chat', {
        playerNames: participantNames,
        chatid: newChatId,
      });
    } catch (error) {
      console.log('Error in start private chat: ', error);
    }
  };
}
