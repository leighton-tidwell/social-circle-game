import React, { useState, useEffect, useContext } from 'react';
import { Button, Text, Spinner, List, ListItem, Box } from '@chakra-ui/react';
import { Link, useHistory } from 'react-router-dom';
import { SplashScreenContainer } from '../../components/';
import { SocketContext } from '../../context/socket';

const HostMatchLobby = ({ lobbyId, isHost }) => {
  const [players, setPlayers] = useState([1]);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [maxPlayers, setMaxPlayers] = useState(0);
  let history = useHistory();
  const socket = useContext(SocketContext);

  const handleStartGame = () => {
    socket.emit('start-hosted-match', { gameid: lobbyId, hostid: socket.id });
  };

  useEffect(() => {
    socket.on('player-joined', ({ totalPlayers, maxPlayers }) => {
      console.log(totalPlayers);
      setPlayers([...Array(totalPlayers)]);
      setTotalPlayers(totalPlayers);
      setMaxPlayers(maxPlayers);
    });

    socket.on('start-game', ({ gameid, hostid }) => {
      if (isHost) {
        return history.push('/game/home');
      }
      return history.push('/game/edit-profile');
    });

    return () => {
      socket.off('player-joined');
      socket.off('start-game');
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
      <Spinner />
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

      <Button
        colorScheme="purpleButton"
        isFullWidth
        fontSize="1.5em"
        height="2.5em"
        fontWeight="400"
      >
        <Link to="/game">Leave</Link>
      </Button>
    </SplashScreenContainer>
  );
};

export default HostMatchLobby;
