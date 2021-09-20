import React, { useEffect } from 'react';
import { Button, Text, Spinner } from '@chakra-ui/react';
import { Link, useHistory } from 'react-router-dom';
import { SplashScreenContainer } from '../../components/';

const FindMatch = ({ socket, onStartGame, onHost, isHost }) => {
  let history = useHistory();

  socket.on('start-game', ({ gameid, hostid }) => {
    onStartGame(gameid);
    if (hostid === socket.id) {
      onHost(true);
      return history.push('/game/host-wait');
    }
    return history.push('/game/edit-profile');
  });

  const handleCancelMatch = () => {
    socket.emit('stop-find-match');
  };

  useEffect(() => {
    socket.emit('find-match');
  }, []);
  return (
    <SplashScreenContainer>
      <Text fontSize="1.5em" fontWeight="500">
        Finding a match <Spinner />
      </Text>
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
