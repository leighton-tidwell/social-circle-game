import React, { useEffect, useState } from 'react';
import { Button, Text, Spinner } from '@chakra-ui/react';
import { Link, useHistory } from 'react-router-dom';
import { SplashScreenContainer } from '../../components/';

const FindMatch = ({ socket, onStartGame, onHost, isHost }) => {
  const [searchingPlayers, setSearchingPlayers] = useState(0);
  const [matchPlayers, setMatchPlayers] = useState(0);
  let history = useHistory();

  socket.on('start-game', ({ gameid, hostid }) => {
    onStartGame(gameid);
    if (hostid === socket.id) {
      onHost(true);
      return history.push('/game/host-wait');
    }
    return history.push('/game/edit-profile');
  });

  socket.on(
    'update-finding-match-count',
    ({ playersSearching, playersRequired }) => {
      setSearchingPlayers(playersSearching);
      setMatchPlayers(playersRequired);
    }
  );

  const handleCancelMatch = () => {
    socket.emit('stop-find-match');
  };

  useEffect(() => {
    socket.emit('find-match');
  }, []);
  return (
    <SplashScreenContainer>
      <Text fontSize="1.5em" fontWeight="500">
        Finding a match ({searchingPlayers}/{matchPlayers})
      </Text>
      <Spinner />
      <Button
        colorScheme="purpleButton"
        isFullWidth
        fontSize="1.5em"
        height="2.5em"
        fontWeight="400"
      >
        <Link to="/game" onClick={handleCancelMatch}>
          Cancel
        </Link>
      </Button>
    </SplashScreenContainer>
  );
};

export default FindMatch;
