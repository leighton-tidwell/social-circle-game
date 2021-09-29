import React, { useState, useEffect, useContext } from 'react';
import {
  Button,
  Text,
  Spinner,
  List,
  ListItem,
  Box,
  useToast,
} from '@chakra-ui/react';
import { Link, useHistory } from 'react-router-dom';
import { SplashScreenContainer } from '../../components';
import { CircleContext } from '../../context/circle';

const HostMatchLobby = () => {
  const [players, setPlayers] = useState([1]);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [maxPlayers, setMaxPlayers] = useState(0);
  const { lobbyId, isHost, socket } = useContext(CircleContext);
  const toast = useToast();
  let history = useHistory();

  const handleStartGame = () => {
    socket.emit('start-hosted-match', { gameid: lobbyId, hostid: socket.id });
  };

  const handleLeaveGame = () => {
    if (isHost) {
      socket.emit('stop-hosted-match', {
        gameid: lobbyId,
        hostid: socket.id,
      });
      return;
    }

    console.log(lobbyId);
    socket.emit('player-left-hosted-match', { gameid: lobbyId });
  };

  useEffect(() => {
    socket.on('player-joined', ({ totalPlayers, maxPlayers }) => {
      setPlayers([...Array(totalPlayers)]);
      setTotalPlayers(totalPlayers);
      setMaxPlayers(maxPlayers);
    });

    socket.on('start-game', () => {
      if (isHost) {
        return history.push('/game/home');
      }

      return history.push('/game/edit-profile');
    });

    socket.on('stop-hosted-match', () => {
      toast({
        title: 'The host has cancelled the game.',
        variant: 'left-accent',
        isClosable: true,
        position: 'top',
      });
      history.push('/game');
    });

    return () => {
      socket.off('player-joined');
      socket.off('start-game');
      socket.off('stop-hosted-match');
    };
  }, []);

  return (
    <SplashScreenContainer>
      <Text fontSize="1.5em" fontWeight="600" color="brand.offtext">
        Match: {lobbyId}
      </Text>
      <Text fontSize="1.5em" fontWeight="500">
        Waiting for players&nbsp;
        {totalPlayers !== 0 && `(${totalPlayers}/${maxPlayers})`}
      </Text>
      {totalPlayers.length !== maxPlayers && <Spinner />}
      <Box textAlign="left" width="100%">
        <List spacing={1}>
          {players.map((player, i) => (
            <ListItem
              key={i}
              fontSize="1.2em"
              fontWeight="600"
              color="brand.offtext"
            >
              Player {i + 1}
            </ListItem>
          ))}
        </List>
      </Box>
      {isHost && (
        <Button
          colorScheme="blueButton"
          isFullWidth
          fontSize="1.5em"
          height="2.5em"
          fontWeight="400"
          onClick={handleStartGame}
        >
          Start Game
        </Button>
      )}
      <Link style={{ width: '100%' }} to="/game">
        <Button
          colorScheme="purpleButton"
          isFullWidth
          fontSize="1.5em"
          height="2.5em"
          fontWeight="400"
          onClick={handleLeaveGame}
        >
          {isHost ? 'Cancel' : 'Leave'}
        </Button>
      </Link>
    </SplashScreenContainer>
  );
};

export default HostMatchLobby;
