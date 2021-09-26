import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { CircleContext, serverString, socket } from '../../context/circle';

import {
  SplashScreen,
  FindMatch,
  JoinMatch,
  HostMatch,
  HostMatchLobby,
  Profile,
  Home,
  Chat,
  PrivateChat,
  Newsfeed,
  Ratings,
  Blocked,
} from '../../components';

const GamePage = () => {
  const [lobbyId, setLobbyId] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [profileSetupCount, setProfileSetupCount] = useState(0);
  const [circleChatOpen, setCircleChatOpen] = useState(false);
  const [ratingsOpen, setRatingsOpen] = useState(false);
  const [ratingCount, setRatingCount] = useState(0);
  const [ratedPlayers, setRatedPlayers] = useState([]);
  const [showBlockPlayerModal, setShowBlockPlayerModal] = useState(false);
  const [influencerChatId, setInfluencerChatId] = useState(null);

  const contextValue = {
    lobbyId,
    setLobbyId,
    isHost,
    setIsHost,
    profileSetupCount,
    setProfileSetupCount,
    circleChatOpen,
    setCircleChatOpen,
    ratingsOpen,
    setRatingsOpen,
    socket,
    serverString,
    ratingCount,
    setRatingCount,
    ratedPlayers,
    setRatedPlayers,
    showBlockPlayerModal,
    setShowBlockPlayerModal,
    influencerChatId,
    setInfluencerChatId,
  };

  const render = typeof window !== 'undefined';
  return (
    <CircleContext.Provider value={contextValue}>
      {render && (
        <Router>
          <Switch>
            <Route path="/game" exact>
              <SplashScreen />
            </Route>
            <Route path="/game/find-match" exact>
              <FindMatch />
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
            <Route
              path="/game/profile/:id"
              component={(props) => (
                <Profile key={window.location.pathname} {...props} />
              )}
              exact
            />
            <Route path="/game/edit-profile" exact>
              <Profile editable />
            </Route>
            <Route path="/game/home" exact>
              <Home />
            </Route>
            <Route path="/game/chat" exact>
              <Chat />
            </Route>
            <Route
              path="/game/chat/:id"
              component={(props) => (
                <PrivateChat key={window.location.pathname} {...props} />
              )}
              exact
            />
            <Route path="/game/newsfeed" exact>
              <Newsfeed />
            </Route>
            <Route path="/game/ratings" exact>
              <Ratings />
            </Route>
            <Route path="/game/blocked" exact>
              <Blocked />
            </Route>
          </Switch>
        </Router>
      )}
    </CircleContext.Provider>
  );
};

export default GamePage;
