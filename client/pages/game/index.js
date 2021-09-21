import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { SocketContext, socket } from '../../context/socket';

import {
  SplashScreen,
  FindMatch,
  JoinMatch,
  HostMatch,
  HostMatchLobby,
  Profile,
  Home,
  Chat,
} from '../../components/';
const GamePage = () => {
  const [lobbyId, setLobbyId] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [circleChatOpen, setCircleChatOpen] = useState(false);

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
    <SocketContext.Provider value={socket}>
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
              />
            </Route>
            <Route path="/game/join-match" exact>
              <JoinMatch onLobbyChange={handleLobbyChange} />
            </Route>
            <Route path="/game/host-match" exact>
              <HostMatch onHost={setIsHost} onLobbyChange={handleLobbyChange} />
            </Route>
            <Route path="/game/host-match/lobby" exact>
              <HostMatchLobby isHost={isHost} lobbyId={lobbyId} />
            </Route>
            <Route
              path="/game/profile/:id"
              component={(props) => (
                <Profile
                  toggleChat={setCircleChatOpen}
                  lobbyId={lobbyId}
                  key={window.location.pathname}
                  isHost={isHost}
                  {...props}
                />
              )}
              exact
            />
            <Route path="/game/edit-profile" exact>
              <Profile
                toggleChat={setCircleChatOpen}
                lobbyId={lobbyId}
                editable
              />
            </Route>
            <Route path="/game/home" exact>
              <Home
                toggleChat={setCircleChatOpen}
                chatOpen={circleChatOpen}
                isHost={isHost}
                lobbyId={lobbyId}
              />
            </Route>
            <Route path="/game/chat" exact>
              <Chat
                toggleChat={setCircleChatOpen}
                isHost={isHost}
                chatOpen={circleChatOpen}
                lobbyId={lobbyId}
              />
            </Route>
          </Switch>
        </Router>
      )}
    </SocketContext.Provider>
  );
};

export default GamePage;
