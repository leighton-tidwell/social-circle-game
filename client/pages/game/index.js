import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { io } from 'socket.io-client';
const socket = io(
  `${process.env.NEXT_PUBLIC_CIRCLE_SERVER}:${process.env.NEXT_PUBLIC_CIRCLE_PORT}`
);

import {
  SplashScreen,
  FindMatch,
  JoinMatch,
  HostMatch,
  HostMatchLobby,
  Profile,
} from '../../components/';
const GamePage = () => {
  const [lobbyID, setLobbyId] = useState(null);
  const [isHost, setIsHost] = useState(false);

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
              <JoinMatch />
            </Route>
            <Route path="/game/host-match" exact>
              <HostMatch />
            </Route>
            <Route path="/game/host-match/lobby" exact>
              <HostMatchLobby />
            </Route>
            <Route path="/game/join-match/lobby" exact>
              Lobby for joining a match
            </Route>
            <Route path="/game/edit-profile" exact>
              <Profile />
            </Route>
          </Switch>
        </Router>
      )}
    </>
  );
};

export default GamePage;
