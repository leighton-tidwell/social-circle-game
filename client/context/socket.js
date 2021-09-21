import React from 'react';
import io from 'socket.io-client';
const socketString = `${process.env.NEXT_PUBLIC_CIRCLE_SERVER}${
  process.env.NEXT_PUBLIC_CIRCLE_PORT
    ? `:${process.env.NEXT_PUBLIC_CIRCLE_PORT}`
    : ''
}`;

export const socket = io(socketString);
export const SocketContext = React.createContext(socket);
