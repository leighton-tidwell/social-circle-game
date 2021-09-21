import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { io } from 'socket.io-client';
const socketString = `${process.env.NEXT_PUBLIC_CIRCLE_SERVER}${
  process.env.NEXT_PUBLIC_CIRCLE_PORT
    ? `:${process.env.NEXT_PUBLIC_CIRCLE_PORT}`
    : ''
}`;
const socket = io(socketString);

import {
  SplashScreen,
  FindMatch,
  JoinMatch,
  HostMatch,
  HostMatchLobby,
  Profile,
  Home,
} from '../../components/';
const GamePage = () => {
  const [lobbyId, setLobbyId] = useState(null);
  const [isHost, setIsHost] = useState(false);

  const handleLobbyChange = (lobby) => {
    setLobbyId(lobby);
  };

  useEffect(() => {
    socket.on('connect', () => {
      console.log('you have connected');
    });
  }, []);

  const render = typeof window === 'undefined' ? false : true;
  return (
    <>
      {render && (
        <Router>
          <Switch>
            <Route path="/game" exact>
              <SplashScreen />
            </Route>
            <Route path="/game/find-match" exact>
              <FindMatch
                onStartGame={setLobbyId}
                onHost={setIsHost}
                isHost={isHost}
                socket={socket}
              />
            </Route>
            <Route path="/game/join-match" exact>
              <JoinMatch socket={socket} onLobbyChange={handleLobbyChange} />
            </Route>
            <Route path="/game/host-match" exact>
              <HostMatch
                socket={socket}
                onHost={setIsHost}
                onLobbyChange={handleLobbyChange}
              />
            </Route>
            <Route path="/game/host-match/lobby" exact>
              <HostMatchLobby
                socket={socket}
                isHost={isHost}
                lobbyId={lobbyId}
              />
            </Route>
            <Route path="/game/profile/:id" exact>
              <Profile socket={socket} lobbyId={lobbyId} />
            </Route>
            <Route path="/game/edit-profile" exact>
              <Profile socket={socket} lobbyId={lobbyId} editable />
            </Route>
            <Route path="/game/home" exact>
              <Home socket={socket} isHost={isHost} lobbyId={lobbyId} />
            </Route>
          </Switch>
        </Router>
      )}
    </>
  );
};

export default GamePage;
