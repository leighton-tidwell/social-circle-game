require('dotenv').config();
const express = require('express');
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

const server = http.createServer(app);
const uuid = new ShortUniqueId({ length: 10 });

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.get('/', (req, res) => {
  res.send('<h1>Hello from your mom</h1>');
});

io.on('connection', (socket) => {
  socket.join('IDLE_ROOM');

  socket.on('find-match', () => {
    console.log(`Socket id: ${socket.id} is requesting to find a match.`);
    socket.join('FIND_MATCH');
    socket.leave('IDLE_ROOM');
    socket.join(uuid());

    const clientsFindingMatch = io.sockets.adapter.rooms.get('FIND_MATCH');
    if (clientsFindingMatch.size === 2) {
      const newLobby = uuid();
      console.log(
        `A new game is starting with the unique lobby id: ${newLobby}.`
      );

      clientsFindingMatch.forEach((clientId) => {
        const clientSocket = io.sockets.sockets.get(clientId);
        clientSocket.join(newLobby);
        clientSocket.leave('FIND_MATCH');
      });

      console.log(
        io.sockets.adapter.rooms.get(newLobby),
        'list of sockets in room'
      );

      io.to(newLobby).emit('start-game');
    }
  });

  socket.on('save-profile', async (user) => {
    const newUser = new userModel(user);

    try {
      // Get all users from room and determine if one is a host yet
      const host = await userModel.find({ gameid: user.gameid, host: true });
      if (host.length === 0) user.host = true;

      await newUser.save();
      socket.emit('profile-saved-successfully');
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
    socket.join(room);
  });

  socket.on('host-match', () => {
    console.log(`Socket id: ${socket.id} is requesting to host a match.`);
    const newLobby = uuid();

    socket.emit('host-match', { lobby: newLobby });

    socket.leave('IDLE_ROOM');
    socket.join(newLobby);
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

server.listen(3001, () => {
  console.log('listening on *:3001');
});
