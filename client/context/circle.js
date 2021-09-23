import React from 'react';
import io from 'socket.io-client';
const socketString = `${process.env.NEXT_PUBLIC_CIRCLE_SERVER}${
  process.env.NEXT_PUBLIC_CIRCLE_PORT
    ? `:${process.env.NEXT_PUBLIC_CIRCLE_PORT}`
    : ''
}`;

export const socket = io(socketString);

export const serverString = `${process.env.NEXT_PUBLIC_CIRCLE_SERVER}${
  process.env.NEXT_PUBLIC_CIRCLE_PORT
    ? `:${process.env.NEXT_PUBLIC_CIRCLE_PORT}`
    : ''
}`;

export const CircleContext = React.createContext({
  lobbyId: null,
  setLobbyId: () => {},
  isHost: null,
  setIsHost: () => {},
  circleChatOpen: false,
  setCircleChatOpen: () => {},
  ratingsOpen: false,
  setRatingsOpen: () => {},
  socket: socket,
  serverString: '',
});