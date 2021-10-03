import 'dotenv/config.js';
import express from 'express';
import cors from 'cors';
import http from 'http';
import routes from './routes';
import { Server } from 'socket.io';
import mongoose from 'mongoose';

// import socket events
import registerEventsHandler from './events';

// Set up mongoose connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error: '));
db.once('open', () => {
  console.log('MongoDB connected successfully!');
});

// Apply middleware to express server
const app = express();
app.use(
  cors({
    origin: ['https://social-circle-game.vercel.app', 'http://localhost:3000'],
  })
);
app.use(express.urlencoded({ extended: true, limit: '16mb' }));
app.use(express.json({ limit: '16mb' }));

// Connect express routes
app.use('/', routes);

// Start express server
const server = http.createServer(app);
const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`Express server listening on *:${port}`);
});

// Setup socket io server
const io = new Server(server, {
  cors: {
    origin: ['https://social-circle-game.vercel.app', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
  },
  transports: ['websocket'],
  pingInterval: 10000,
  pingTimeout: 10000,
});

io.on('connection', (socket) => {
  console.log(`A user has connected. (SOCKETID: ${socket.id})`);
  console.log(`There are ${io.sockets.sockets.size} sockets connected.`);
  registerEventsHandler(io, socket);
});
