import React, { useEffect, useState, useContext } from 'react';
import { Button, Text, Spinner, useToast } from '@chakra-ui/react';
import { Link, useHistory } from 'react-router-dom';
import { SplashScreenContainer } from '../../components/';
import { CircleContext } from '../../context/circle';

const FindMatch = () => {
  const [searchingPlayers, setSearchingPlayers] = useState(0);
  const [matchPlayers, setMatchPlayers] = useState(0);
  let history = useHistory();
  const toast = useToast();
  const { setLobbyId, setIsHost, socket } = useContext(CircleContext);

  const handleCancelMatch = () => {
    socket.emit('stop-find-match');
  };

  useEffect(() => {
    socket.on('start-game', ({ gameid, hostid }) => {
      setLobbyId(gameid);
      if (hostid === socket.id) {
        setIsHost(true);
        toast({
          title: 'You have been selected as the host!',
          position: 'top',
          isClosable: true,
          variant: 'left-accent',
        });
        return history.push('/game/home');
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

    socket.emit('find-match');

    return () => {
      socket.off('start-game');
      socket.off('update-finding-match-count');
    };
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
