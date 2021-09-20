import React, { useEffect, useState } from 'react';
import { Box, Button, Input, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { SplashScreenContainer } from '../../components/';

const HostMatch = ({ socket, onLobbyChange, onHost }) => {
  const [gameId, setGameId] = useState('');

  socket.on('host-match', ({ lobby }) => {
    setGameId(lobby);
    onHost(true);
  });

  useEffect(() => {
    socket.emit('host-match');
  }, []);

  return (
    <SplashScreenContainer>
      <Box width="100%">
        <Text
          fontWeight="700"
          color="brand.offtext"
          fontSize="1.5em"
          align="left"
        >
          Match Code:
        </Text>
        <Input size="lg" value={gameId} borderColor="brand.main" isReadOnly />
      </Box>

      <Button
        colorScheme="blueButton"
        isFullWidth
        fontSize="1.5em"
        height="2.5em"
        fontWeight="400"
      >
        <Link to="/game/host-match/lobby" onClick={() => onLobbyChange(gameId)}>
          Host Match
        </Link>
      </Button>
      <Button
        colorScheme="purpleButton"
        isFullWidth
        fontSize="1.5em"
        height="2.5em"
        fontWeight="400"
      >
        <Link to="/game">Cancel</Link>
      </Button>
    </SplashScreenContainer>
  );
};

export default HostMatch;
