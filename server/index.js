require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const ShortUniqueId = require('short-unique-id');
const mongoose = require('mongoose');
const {
  userModel,
  messageModel,
  privateChatModel,
  privateMessageModel,
  newsFeedModel,
  ratingsModel,
} = require('./models');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function () {
  console.log('MongoDB connected successfully.');
});

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const server = http.createServer(app);
const uuid = new ShortUniqueId({ length: 10 });

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.get('/total-games', async (req, res) => {
  const totalGames = await userModel.find().distinct('gameid');
  res.json({ totalGames: totalGames.length });
});

app.get('/total-players', async (req, res) => {
  const totalPlayers = await userModel.find().distinct('socketid');
  res.json({ totalPlayers: totalPlayers.length });
});

app.post('/list-players', async (req, res) => {
  const gameid = req.body.gameid;
  const playerList = await userModel.find({ gameid: gameid, host: false });
  if (playerList.length === 0) return res.json({ invalid: true });

  return res.json({ playerList });
});

app.post('/get-messages', async (req, res) => {
  const gameid = req.body.gameid;
  const listOfMessages = await messageModel.find({ gameid: gameid });

  return res.json({ listOfMessages });
});

app.post('/get-private-messages', async (req, res) => {
  const chatid = req.body.chatid;
  const listOfMessages = await privateMessageModel.find({
    chatid: chatid,
  });

  return res.json({ listOfMessages });
});

app.post('/get-chat-participants', async (req, res) => {
  const gameid = req.body.gameid;
  const chatid = req.body.chatid;
  const chatData = await privateChatModel.find({
    gameid: gameid,
    chatid: chatid,
  });
  const listOfParticipants = chatData;

  return res.json({ listOfParticipants });
});

app.post('/get-private-chat-list', async (req, res) => {
  const gameid = req.body.gameid;
  const listOfChats = await privateChatModel.find({ gameid: gameid });

  return res.json({ listOfChats });
});

app.post('/get-newsfeed', async (req, res) => {
  const gameid = req.body.gameid;
  const newsFeed = await newsFeedModel.find({ gameid: gameid });

  return res.json({ newsFeed });
});

app.post('/player-information', async (req, res) => {
  const socketid = req.body.socketid;
  const playerData = await userModel.find({ socketid: socketid });
  if (playerData.length === 0) return res.json({ invalid: true });

  return res.json({ playerData });
});

app.post('/get-ratings', async (req, res) => {
  const gameid = req.body.gameid;
  const listOfRatings = await ratingsModel.find({ gameid: gameid });

  return res.json({ listOfRatings });
});

const MAX_PLAYERS = 3;

io.on('connection', (socket) => {
  socket.join('IDLE_ROOM');

  socket.on('find-match', async () => {
    console.log(`Socket id: ${socket.id} is requesting to find a match.`);
    socket.join('FIND_MATCH');
    socket.leave('IDLE_ROOM');

    const clientsFindingMatch = io.sockets.adapter.rooms.get('FIND_MATCH');
    io.to('FIND_MATCH').emit('update-finding-match-count', {
      playersSearching: clientsFindingMatch.size,
      playersRequired: MAX_PLAYERS,
    });
    if (clientsFindingMatch.size === MAX_PLAYERS) {
      const newLobby = uuid();
      console.log(
        `A new game is starting with the unique lobby id: ${newLobby}.`
      );

      const hostIndex = Math.floor(
        Math.random() * (clientsFindingMatch.size - 0) + 0
      );

      console.log(hostIndex, 'random selected host');

      let i = 0;
      let hostSocketId = '';
      for (const clientId of clientsFindingMatch) {
        const clientSocket = io.sockets.sockets.get(clientId);
        clientSocket.join(newLobby);
        clientSocket.leave('FIND_MATCH');

        const newUserData = {
          gameid: newLobby,
          socketid: clientId,
        };

        if (i === hostIndex) {
          newUserData.host = true;
          hostSocketId = clientSocket.id;
        }

        const newUser = new userModel(newUserData);
        try {
          await newUser.save();
          i++;
        } catch (error) {
          console.log(error);
        }
      }

      console.log(
        io.sockets.adapter.rooms.get(newLobby),
        'list of sockets in room'
      );

      io.to(newLobby).emit('start-game', {
        gameid: newLobby,
        hostid: hostSocketId,
      });
    }
  });

  socket.on('save-profile', async (user) => {
    try {
      await userModel.findOneAndUpdate(
        { gameid: user.gameid, socketid: user.socketid },
        user
      );
      socket.emit('profile-saved-successfully');
      io.to(user.gameid).emit('player-joined-circle', { user });
    } catch (error) {
      console.log(error);
      socket.emit('profile-saved-unsuccessfully');
    }
  });

  socket.on('toggle-circle-chat', ({ value, gameid }) => {
    io.to(gameid).emit('toggle-circle-chat', value);
  });

  socket.on('send-circle-chat', async (newMessage) => {
    try {
      const user = await userModel.findOne({ socketid: socket.id });

      const saveMessage = {
        ...newMessage,
        avatar: user.profilePicture,
      };

      const message = new messageModel(saveMessage);
      try {
        await message.save();
      } catch (error) {
        console.log(error);
      }

      io.to(newMessage.gameid).emit('new-circle-message');
    } catch (error) {
      console.log(error);
    }
  });

  socket.on('start-private-chat', async ({ gameid, socketid, player }) => {
    const newChatId = uuid();
    const participants = [socketid, player];
    const participantNames = await Promise.all(
      participants.map(async (participant) => {
        const user = await userModel.findOne({ socketid: participant });
        return user.name;
      })
    );

    const newChat = {
      gameid,
      chatid: newChatId,
      participants,
      participantNames,
    };

    const saveChat = new privateChatModel(newChat);
    try {
      await saveChat.save();
    } catch (error) {
      console.log(error);
    }

    participants.forEach((participant) => {
      io.sockets.sockets.get(participant).join(newChatId);
    });

    io.to(newChatId).emit('new-private-chat', {
      playerName: participantNames[1],
      chatid: newChatId,
    });

    io.to(gameid).emit('host-new-private-chat', {
      playerNames: participantNames,
      chatid: newChatId,
    });

    const host = await userModel.findOne({ gameid: gameid, host: true });
    const hostSocket = host.socketid;
    io.sockets.sockets.get(hostSocket).join(newChatId);
  });

  socket.on('send-private-chat', async (newMessage) => {
    try {
      const user = await userModel.findOne({ socketid: socket.id });

      const saveMessage = {
        ...newMessage,
        avatar: user.profilePicture,
      };

      const message = new privateMessageModel(saveMessage);
      try {
        await message.save();
      } catch (error) {
        console.log(error);
      }

      io.to(newMessage.chatid).emit('new-private-message');
    } catch (error) {
      console.log(error);
    }
  });

  socket.on('new-newsfeed', async (message) => {
    const saveMessage = new newsFeedModel(message);

    try {
      await saveMessage.save();
    } catch (error) {
      console.log(error);
    }

    io.to(message.gameid).emit('new-newsfeed');
  });

  socket.on('load-home', async (gameid) => {
    try {
      // get all users in that game
      const players = await userModel.find({ gameid: gameid });

      socket.emit('load-home', players);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on('toggle-ratings', ({ value, gameid }) => {
    io.to(gameid).emit('toggle-ratings', value);
  });

  socket.on('submit-ratings', async ({ gameid, player, ratings }) => {
    const newRating = {
      gameid,
      socketid: player,
      rating: ratings,
    };

    const saveRating = new ratingsModel(newRating);
    await saveRating.save();

    io.to(gameid).emit('rating-submitted');
  });

  socket.on('finish-ratings', async ({ gameid }) => {
    const getRatings = await ratingsModel.find({ gameid: gameid });

    // TODO: Change rating schema to be { socketid: '', rating: '' }

    // let ratees = [];
    // getRatings.forEach((rating) => {
    //   const userRatings = rating.ratings;
    //   userRatings.forEach((individualRating) => Object.entries(individualRating).forEach(([socketId, score]) => {
    //     const exists = ratees.some(e => e.hasOwnProperty(socketId));
    //     if(exists){
    //       const index = ratees.findIndex(r => r[socketId] !== undefined);
    //       ratees[index][socketId] = score + ratings[index][socketId]
    //     }
    //     else {
    //       ratees.push({[socketId]:score})
    //     }
    //   }))
    // });

    // sort in ascending order
  });

  socket.on('stop-find-match', () => {
    console.log(
      `Socket id: ${socket.id} is requesting to stop finding a match.`
    );
    socket.leave('FIND_MATCH');
    socket.join('IDLE_ROOM');
  });

  socket.on('join-match', (room) => {
    console.log(`Socket id: ${socket.id} is requesting to join match ${room}.`);

    const totalPlayers = io.sockets.adapter.rooms.get(room).size;
    if (totalPlayers !== MAX_PLAYERS) {
      socket.leave('IDLE_ROOM');
      socket.join(room);
      socket.emit('join-match');
      io.to(room).emit('player-joined', {
        totalPlayers: totalPlayers + 1,
        maxPlayers: MAX_PLAYERS,
      });
    } else {
      socket.emit('failed-join', { reason: 'full' });
    }
  });

  socket.on('host-match', () => {
    const newLobby = uuid();
    console.log(
      `Socket id: ${socket.id} is requesting to host match ${newLobby}.`
    );

    socket.emit('host-match', { lobby: newLobby });

    socket.leave('IDLE_ROOM');
    socket.join(newLobby);
  });

  socket.on('start-hosted-match', async ({ gameid, hostid }) => {
    const clientsInHostedLobby = io.sockets.adapter.rooms.get(gameid);

    for (const clientId of clientsInHostedLobby) {
      const newUserData = {
        gameid,
        socketid: clientId,
      };

      if (clientId === hostid) {
        newUserData.host = true;
      }

      const newUser = new userModel(newUserData);
      try {
        await newUser.save();
      } catch (error) {
        console.log(error);
      }
    }

    io.to(gameid).emit('start-game', {
      gameid: gameid,
      hostid: hostid,
    });
  });

  socket.on('stop-hosted-match', ({ gameid, hostid }) => {
    const clientsInHostedLobby = io.sockets.adapter.rooms.get(gameid);

    for (const clientId of clientsInHostedLobby) {
      const clientSocket = io.sockets.sockets.get(clientId);

      if (clientId !== hostid) clientSocket.emit('stop-hosted-match');
      clientSocket.leave(gameid);
    }
  });

  socket.on('disconnect', async () => {
    console.log(`${socket.id} has disconnected.`);
    // Lets find any games they were apart of and make sure the database reflects them leaving
    try {
      const playerData = await userModel.findOneAndUpdate(
        { socketid: socket.id },
        { disconnected: true, gameid: '' }
      );
      if (!playerData) return; // Player never started game
      const playerName = playerData.name || 'Host';
      const gameid = playerData.gameid;
      const isHost = playerData.host;
      if (!isHost) {
        io.to(gameid).emit('player-disconnected', {
          playerName,
        });
      } else {
        io.to(gameid).emit('host-disconnect');
        io.socketsLeave(gameid);
        await userModel.updateMany({ gameid: gameid }, { gameid: '' });
        console.log('Host leave cleanup complete.');
      }
    } catch (error) {
      console.log(error);
    } finally {
      console.log(`${socket.id} has been removed from their game.`);
    }
  });
});

io.of('/').adapter.on('create-room', (room) => {
  //console.log(`room ${room} was created`);
});

io.of('/').adapter.on('join-room', (room, id) => {
  //console.log(`socket ${id} has joined room ${room}`);
});

const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`listening on *:${port}`);
});
