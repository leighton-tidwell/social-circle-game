import React, { useEffect, useState, useContext } from 'react';
import { Box, Button, Input, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { SplashScreenContainer } from '../../components';
import { CircleContext } from '../../context/circle';

const HostMatch = () => {
  const [gameId, setGameId] = useState('');
  const { setLobbyId, setIsHost, socket } = useContext(CircleContext);

  useEffect(() => {
    socket.emit('host-match');

    socket.on('host-match', ({ lobby }) => {
      setGameId(lobby);
      setIsHost(true);
    });

    return () => {
      socket.off('host-match');
    };
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
      <Link
        style={{ width: '100%' }}
        to="/game/host-match/lobby"
        onClick={() => setLobbyId(gameId)}
      >
        <Button
          colorScheme="blueButton"
          isFullWidth
          fontSize="1.5em"
          height="2.5em"
          fontWeight="400"
        >
          Host Match
        </Button>
      </Link>
      <Link style={{ width: '100%' }} to="/game">
        <Button
          colorScheme="purpleButton"
          isFullWidth
          fontSize="1.5em"
          height="2.5em"
          fontWeight="400"
        >
          Cancel
        </Button>
      </Link>
    </SplashScreenContainer>
  );
};

export default HostMatch;
