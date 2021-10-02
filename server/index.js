require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const ShortUniqueId = require('short-unique-id');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const {
  userModel,
  messageModel,
  privateChatModel,
  privateMessageModel,
  newsFeedModel,
  ratingsModel,
  blockModel,
  gameModel,
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
app.use(
  cors({
    origin: ['https://social-circle-game.vercel.app', 'http://localhost:3000'],
  })
);
app.use(express.urlencoded({ extended: true, limit: '16mb' }));
app.use(express.json({ limit: '16mb' }));

const server = http.createServer(app);
const uuid = new ShortUniqueId({ length: 10 });
const hostuuid = new ShortUniqueId({ length: 6, dictionary: 'alpha_upper' });

const io = new Server(server, {
  cors: {
    origin: ['https://social-circle-game.vercel.app', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
  },
  transports: ['websocket'],
  pingInterval: 10000,
  pingTimeout: 10000,
});

app.get('/total-games', async (req, res) => {
  const totalGames = await gameModel.find();
  res.json({ totalGames: totalGames.length });
});

app.get('/total-players', async (req, res) => {
  const totalPlayers = await userModel.find().distinct('socketid');
  res.json({ totalPlayers: totalPlayers.length });
});

app.post('/upload-profile', async (req, res) => {
  const user = req.body.user;
  const savedUser = await userModel.findOneAndUpdate(
    { socketid: user.socketid },
    user,
    { upsert: true }
  );

  res.sendStatus(200);
});

app.post('/list-players', async (req, res) => {
  const gameid = req.body.gameid;
  const playerList = await userModel.find({
    gameid: gameid,
    host: false,
    blocked: false,
  });
  if (playerList.length === 0) return res.json({ invalid: true });

  return res.json({ playerList });
});

app.post('/get-host', async (req, res) => {
  const gameid = req.body.gameid;
  const host = await userModel.find({ gameid: gameid, host: true });

  return res.json({ host });
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

app.post('/get-user-private-chats', async (req, res) => {
  const gameid = req.body.gameid;
  const socketid = req.body.socketid;
  const listOfChats = await privateChatModel.find({ gameid: gameid });
  const userChats = listOfChats.filter((chat) =>
    chat.participants.includes(socketid)
  );

  return res.json({ userChats });
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
  const ratingCount = req.body.ratingCount;
  const listOfRatings = await ratingsModel.find({
    gameid: gameid,
    ratingCount: ratingCount,
  });

  return res.json({ listOfRatings });
});

const MAX_PLAYERS = 7;
const MAX_RATINGS = 3;

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

        try {
          await userModel.findOneAndUpdate({ socketid: clientId }, newUserData);
          i++;
        } catch (error) {
          console.log(error);
        }
      }

      const newGame = {
        gameid: newLobby,
      };

      const saveGame = new gameModel(newGame);

      try {
        await saveGame.save();
        console.log(
          io.sockets.adapter.rooms.get(newLobby),
          'list of sockets in room'
        );

        io.to(newLobby).emit('start-game', {
          gameid: newLobby,
          hostid: hostSocketId,
        });
      } catch (error) {
        console.log(error);
      }
    }
  });

  // socket.on('save-profile', (user) => {
  //   io.to(user.gameid).emit('player-joined-circle', { user });
  // });

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

      try {
        const message = new messageModel(saveMessage);
        await message.save();
        io.to(newMessage.gameid).emit('new-circle-message', saveMessage);
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  });

  socket.on('start-private-chat', async ({ gameid, socketid, player }) => {
    const newChatId = uuid();
    const participants = [socketid, player];

    // lets check to see if an existing private chat is here
    const listOfChats = await privateChatModel.find({ gameid: gameid });
    const foundChat = listOfChats.filter(
      (chat) =>
        chat.participants.includes(socketid) &&
        chat.participants.includes(player)
    );
    if (foundChat.length !== 0) {
      const clientSocket = io.sockets.sockets.get(socketid);
      clientSocket.emit('go-to-chat', { chatid: foundChat[0].chatid });
      return;
    }

    const participantNames = await Promise.map(
      participants,
      async (participant) => {
        const user = await userModel.findOne({ socketid: participant }).exec();
        return user.name;
      }
    );

    const newChat = {
      gameid,
      chatid: newChatId,
      participants,
      participantNames,
    };

    try {
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
      const hostSocket = host.socketid;
      io.sockets.sockets.get(hostSocket).join(newChatId);

      io.to(gameid).emit('host-new-private-chat', {
        playerNames: participantNames,
        chatid: newChatId,
      });
    } catch (error) {
      console.log(error);
    }
  });

  socket.on('send-private-chat', async (newMessage) => {
    try {
      const user = await userModel.findOne({ socketid: socket.id });

      const saveMessage = {
        ...newMessage,
        avatar: user.profilePicture,
      };

      try {
        const message = new privateMessageModel(saveMessage);
        await message.save();
        io.to(newMessage.chatid).emit('new-private-message', saveMessage);
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  });

  socket.on('new-newsfeed', async (message) => {
    try {
      const saveMessage = new newsFeedModel(message);
      await saveMessage.save();
      io.to(message.gameid).emit('new-newsfeed');
    } catch (error) {
      console.log(error);
    }
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

  socket.on(
    'submit-ratings',
    async ({ gameid, player, ratings, ratingCount }) => {
      const newRating = {
        gameid,
        socketid: player,
        rating: ratings,
        ratingCount,
      };

      try {
        const saveRating = new ratingsModel(newRating);
        await saveRating.save();

        io.to(gameid).emit('rating-submitted');
      } catch (error) {
        console.log(error);
      }
    }
  );

  socket.on('finish-ratings', async ({ gameid, ratingCount }) => {
    const getRatings = await ratingsModel.find({
      gameid: gameid,
      ratingCount: ratingCount,
    });
    const listOfRatings = getRatings.map((user) => user.rating);

    let ratedScores = [];
    listOfRatings.forEach((listedRating) =>
      listedRating.forEach((rating) => {
        const index = ratedScores.findIndex((r) => {
          return r.socketid === rating.socketid;
        });

        if (index === -1) {
          ratedScores.push({
            socketid: rating.socketid,
            rating: rating.rating,
          });
        } else {
          ratedScores[index] = {
            ...ratedScores[index],
            rating: ratedScores[index].rating + rating.rating,
          };
        }
      })
    );

    const sortedScores = ratedScores.sort((a, b) =>
      a.rating > b.rating ? 1 : -1
    );

    const updatedPlayerList = await Promise.map(
      sortedScores,
      async (rating) => {
        const individualPlayer = await userModel
          .findOne({
            socketid: rating.socketid,
          })
          .exec();
        const ratedPlayer = {
          name: individualPlayer.name,
          profilePicture: individualPlayer.profilePicture,
          socketid: individualPlayer.socketid,
          rating: rating.rating,
        };
        return ratedPlayer;
      }
    );

    io.to(gameid).emit('ratings-calculated', updatedPlayerList);

    if (ratingCount === MAX_RATINGS - 1) {
      io.to(gameid).emit('next-rating-last');
    }

    if (ratingCount >= MAX_RATINGS || updatedPlayerList.length <= 3) {
      io.to(gameid).emit('game-over', {
        winnerOne: updatedPlayerList[0].name,
        winnerTwo: updatedPlayerList[1].name,
      });
      return;
    }

    const influencerChat = uuid();

    ratedScores.map((rating, i) => {
      if (i === 0 || i === 1) {
        const playerSocket = io.sockets.sockets.get(rating.socketid);
        playerSocket.emit('block-player-modal', {
          influencerChat,
          winnerOne: updatedPlayerList[0].socketid,
          winnerTwo: updatedPlayerList[1].socketid,
        });
        playerSocket.join(influencerChat);
      }
    });
  });

  socket.on(
    'send-influencer-message',
    ({ influencerChatId, name, message }) => {
      io.to(influencerChatId).emit('influencer-chat', {
        name,
        message,
      });
    }
  );

  socket.on('select-block', async ({ player, influencerChatId }) => {
    const findBlocks = await blockModel.findOne({
      influencerChatId: influencerChatId,
    });

    if (findBlocks?.length === 0 || findBlocks === null) {
      const newBlockEntry = {
        influencerChatId,
        blocks: [
          {
            player: socket.id,
            block: player,
          },
        ],
      };
      const saveBlock = new blockModel(newBlockEntry);
      await saveBlock.save();
      return;
    }

    const indexOfPlayerChoice = findBlocks.blocks.findIndex(
      (d) => d.player === socket.id
    );

    if (indexOfPlayerChoice === -1) {
      const newBlockEntry = [
        ...findBlocks.blocks,
        {
          player: socket.id,
          block: player,
        },
      ];

      await blockModel.updateOne(
        { influencerChatId: influencerChatId },
        { blocks: newBlockEntry }
      );
      return;
    }

    let newBlockEntry = [...findBlocks.blocks];
    newBlockEntry[indexOfPlayerChoice] = {
      player: socket.id,
      block: player,
    };
    await blockModel.updateOne(
      { influencerChatId: influencerChatId },
      { blocks: newBlockEntry }
    );
    return;
  });

  socket.on('block-player', async (influencerChatId, lobbyId) => {
    const findBlocks = await blockModel.findOne({
      influencerChatId: influencerChatId,
    });

    if (findBlocks.length === 0) return; // add error handling

    const blockedPlayers = findBlocks.blocks.map(
      (blockChoice) => blockChoice.block
    );

    const uniqueBlockedPlayers = new Set(blockedPlayers);

    if (blockedPlayers.length !== 2)
      return socket.emit(
        'block-error',
        'The other player has not selected a player to block.'
      );

    if (uniqueBlockedPlayers.size === blockedPlayers.length)
      return socket.emit(
        'block-error',
        'Both players must agree on who to block.'
      );

    io.to(influencerChatId).emit('successfully-blocked-player');
    const blockedSocket = io.sockets.sockets.get(blockedPlayers[0]);
    blockedSocket.emit('blocked');

    const blockedPlayer = await userModel.findOneAndUpdate(
      { socketid: blockedSocket.id },
      { blocked: true }
    );
    io.to(lobbyId).emit('blocked-player', blockedPlayer.name);
  });

  socket.on('stop-find-match', () => {
    console.log(
      `Socket id: ${socket.id} is requesting to stop finding a match.`
    );
    socket.leave('FIND_MATCH');
    socket.join('IDLE_ROOM');
    try {
      const clientsFindingMatch = io.sockets.adapter.rooms.get('FIND_MATCH');
      io.to('FIND_MATCH').emit('update-finding-match-count', {
        playersSearching: clientsFindingMatch.size,
        playersRequired: MAX_PLAYERS,
      });
    } catch (error) {
      console.log('Error when updating find match.', error);
    }
  });

  socket.on('join-match', (room) => {
    console.log(`Socket id: ${socket.id} is requesting to join match ${room}.`);
    try {
      const totalPlayers = io.sockets.adapter.rooms.get(room).size;
      if (totalPlayers !== MAX_PLAYERS) {
        socket.leave('IDLE_ROOM');
        socket.join(room);
        socket.emit('join-match', room);
        io.to(room).emit('player-joined', {
          totalPlayers: totalPlayers + 1,
          maxPlayers: MAX_PLAYERS,
        });
      } else {
        socket.emit('failed-join', { reason: 'full' });
      }
    } catch (error) {
      console.log(error);
    }
  });

  socket.on('player-left-hosted-match', ({ gameid }) => {
    try {
      const totalPlayers = io.sockets.adapter.rooms.get(gameid).size;
      socket.leave(gameid);
      socket.join('IDLE_ROOM');
      io.to(gameid).emit('player-joined', {
        totalPlayers: totalPlayers - 1,
        maxPlayers: MAX_PLAYERS,
      });
    } catch (error) {
      console.log(error);
    }
  });

  socket.on('host-match', () => {
    const newLobby = hostuuid();
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
        host: false,
      };

      if (clientId === hostid) {
        newUserData.host = true;
      }

      try {
        await userModel
          .findOneAndUpdate({ socketid: clientId }, newUserData, {
            upsert: true,
          })
          .exec();
      } catch (error) {
        console.log(error);
      }
    }

    const newGame = {
      gameid,
    };

    try {
      const saveGame = new gameModel(newGame);
      await saveGame.save();
      io.to(gameid).emit('start-game', {
        gameid: gameid,
        hostid: hostid,
      });
    } catch (error) {
      console.log(error);
    }
  });

  socket.on('stop-hosted-match', ({ gameid, hostid }) => {
    try {
      const clientsInHostedLobby = io.sockets.adapter.rooms.get(gameid);

      for (const clientId of clientsInHostedLobby) {
        const clientSocket = io.sockets.sockets.get(clientId);

        if (clientId !== hostid) clientSocket.emit('stop-hosted-match');
        clientSocket.leave(gameid);
      }
    } catch (error) {
      console.log(error);
    }
  });

  socket.on('disconnect', async () => {
    console.log(`${socket.id} has disconnected.`);
    // Lets find any games they were apart of and make sure the database reflects them leaving
    try {
      const playerData = await userModel.findOneAndUpdate(
        { socketid: socket.id },
        {
          disconnected: true,
          gameid: '',
          profilePicture: '',
          name: '',
          age: '',
          bio: '',
          relationshipStatus: '',
        }
      );
      if (!playerData) {
        try {
          // lets emit an updater to find match room to double check number of players
          const clientsFindingMatch =
            io.sockets.adapter.rooms.get('FIND_MATCH');
          io.to('FIND_MATCH').emit('update-finding-match-count', {
            playersSearching: clientsFindingMatch.size,
            playersRequired: MAX_PLAYERS,
          });
        } catch (error) {
          console.log(error);
        }

        return;
      } // Player never started game
      const playerName = playerData.name || 'A player';
      const gameid = playerData.gameid;
      const isHost = playerData.host;
      if (!isHost) {
        io.to(gameid).emit('player-disconnected', {
          playerName,
        });
      } else {
        io.to(gameid).emit('host-disconnect');
        io.socketsLeave(gameid);
        await userModel.updateMany(
          { gameid: gameid },
          {
            gameid: '',
            profilePicture: '',
            name: '',
            age: '',
            bio: '',
            relationshipStatus: '',
          }
        );
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
