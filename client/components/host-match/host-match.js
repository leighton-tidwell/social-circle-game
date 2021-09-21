import React, { useEffect, useState, useContext } from 'react';
import { Box, Button, Input, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { SplashScreenContainer } from '../../components/';
import { SocketContext } from '../../context/socket';

const HostMatch = ({ onLobbyChange, onHost }) => {
  const [gameId, setGameId] = useState('');
  const socket = useContext(SocketContext);

  useEffect(() => {
    socket.emit('host-match');

    socket.on('host-match', ({ lobby }) => {
      setGameId(lobby);
      onHost(true);
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
