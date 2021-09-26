import React, { useEffect, useState, useContext } from 'react';
import {
  Grid,
  GridItem,
  Avatar,
  Text,
  Button,
  Spinner,
  Stack,
} from '@chakra-ui/react';
import { useBreakpointValue } from '@chakra-ui/media-query';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { CircleInterface } from '../../components';
import { CircleContext } from '../../context/circle';

const Home = () => {
  const [playerList, setPlayerList] = useState([]);
  const {
    socket,
    isHost,
    lobbyId,
    serverString,
    ratingsOpen,
    circleChatOpen,
    profileSetupCount,
  } = useContext(CircleContext);
  const history = useHistory();

  const goToPlayerProfile = (profile) => {
    history.push(`/game/profile/${profile}`);
  };

  const fetchPlayerList = async () => {
    try {
      const {
        data: { playerList: fetchedPlayerList },
      } = await axios.post(`${serverString}/list-players`, {
        gameid: lobbyId,
      });
      if (fetchedPlayerList) setPlayerList(fetchedPlayerList);
    } catch (error) {
      console.error(error);
    }
  };

  const avatarSize = useBreakpointValue({ xs: 'lg', md: 'xl', lg: '2xl' });

  const toggleCircleChat = () => {
    socket.emit('toggle-circle-chat', {
      value: !circleChatOpen,
      gameid: lobbyId,
    });
  };

  const toggleRatingsHandler = () => {
    socket.emit('toggle-ratings', { value: !ratingsOpen, gameid: lobbyId });
  };

  const startPrivateChat = (player) => {
    socket.emit('start-private-chat', {
      gameid: lobbyId,
      socketid: socket.id,
      player,
    });
  };

  useEffect(() => {
    socket.on('player-joined-circle', () => {
      fetchPlayerList();
    });

    socket.on('player-disconnected', () => {
      fetchPlayerList();
    });

    fetchPlayerList();

    return () => {
      socket.off('player-joined-circle');
      socket.off('player-disconnected');
    };
  }, []);

  return (
    <CircleInterface>
      <Stack
        direction={{ xs: 'column' }}
        height={{ xs: '100%', lg: '95%' }}
        marginTop={{ xs: isHost ? '5em' : '0px', sm: '0px' }}
      >
        <Grid
          templateColumns={{
            xs: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
          }}
          templateRows={{
            xs: isHost ? '20% 20% 20% 20%' : '25% 25% 25% 25%',
            md: '1fr 1fr',
          }}
          gap={5}
          height={{ xs: '80%', md: '95%' }}
          marginBottom={{ xs: '-3em', md: '0px' }}
        >
          {playerList.map((player) => (
            <GridItem
              key={player.socketid}
              border="1px"
              borderColor="brand.secondary"
              borderRadius="8px"
              p={5}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
            >
              <Avatar
                name={player.name}
                src={player.profilePicture}
                size={avatarSize}
                onClick={() => goToPlayerProfile(player.socketid)}
                cursor="pointer"
                borderColor="brand.main"
                showBorder
              />
              {!player.name && 'Setting up profile'}
              <Text fontSize="1.5em" fontWeight="600">
                {player.name || <Spinner />}
              </Text>
              {!isHost && player.socketid !== socket.id && (
                <Button
                  onClick={() => startPrivateChat(player.socketid)}
                  colorScheme="purpleButton"
                  isFullWidth
                >
                  Chat
                </Button>
              )}
            </GridItem>
          ))}
        </Grid>
        {isHost && profileSetupCount !== playerList.length && (
          <Text>Waiting for players to setup profiles...</Text>
        )}
        {isHost && profileSetupCount === playerList.length && (
          <Grid
            gap={1}
            templateColumns={{ xs: 'repeat(2,1fr)', lg: 'repeat(4,1fr)' }}
          >
            <GridItem
              colSpan={{ xs: 2, lg: 4 }}
              display="flex"
              justifyContent="center"
            >
              <Text fontSize="1.5em" fontWeight="700" color="brand.offtext">
                Host Panel
              </Text>
            </GridItem>
            {circleChatOpen && (
              <Button onClick={toggleCircleChat} colorScheme="blueButton">
                Close Circle Chat
              </Button>
            )}
            {!circleChatOpen && (
              <Button onClick={toggleCircleChat} colorScheme="purpleButton">
                Open Circle Chat
              </Button>
            )}
            <Button colorScheme="purpleButton">Ask Me Anything</Button>
            <Button
              onClick={toggleRatingsHandler}
              colorScheme="purpleButton"
              isDisabled={ratingsOpen}
            >
              Ratings
            </Button>
          </Grid>
        )}
      </Stack>
    </CircleInterface>
  );
};

export default Home;
