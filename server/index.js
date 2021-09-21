require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const ShortUniqueId = require('short-unique-id');
const mongoose = require('mongoose');
const userModel = require('./models');

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

app.post('/player-information', async (req, res) => {
  const socketid = req.body.socketid;
  const playerData = await userModel.find({ socketid: socketid });
  if (playerData.length === 0) return res.json({ invalid: true });

  return res.json({ playerData });
});

const MAX_PLAYERS = 3;

io.on('connection', (socket) => {
  socket.join('IDLE_ROOM');

  socket.on('find-match', async () => {
    console.log(`Socket id: ${socket.id} is requesting to find a match.`);
    socket.join('FIND_MATCH');
    socket.leave('IDLE_ROOM');
    socket.join(uuid());

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
      console.log('Trying to save profile', user.name);
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

  socket.on('load-home', async (gameid) => {
    try {
      // get all users in that game
      const players = await userModel.find({ gameid: gameid });

      socket.emit('load-home', players);
    } catch (error) {
      console.log(error);
    }
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
    console.log(`Socket id: ${socket.id} is requesting to host a match.`);
    const newLobby = uuid();

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

  socket.on('disconnect', () => {
    console.log(`${socket.id} has disconnected.`);
  });
});

io.of('/').adapter.on('create-room', (room) => {
  console.log(`room ${room} was created`);
});

io.of('/').adapter.on('join-room', (room, id) => {
  console.log(`socket ${id} has joined room ${room}`);
});

const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`listening on *:${port}`);
});
