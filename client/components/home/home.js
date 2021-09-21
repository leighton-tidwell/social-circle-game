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
import { CircleInterface } from '../../components/';
import { SocketContext } from '../../context/socket';
import axios from 'axios';

const serverString = `${process.env.NEXT_PUBLIC_CIRCLE_SERVER}${
  process.env.NEXT_PUBLIC_CIRCLE_PORT
    ? `:${process.env.NEXT_PUBLIC_CIRCLE_PORT}`
    : ''
}`;

const Home = ({ lobbyId, isHost, chatOpen, toggleChat }) => {
  const [playerList, setPlayerList] = useState([]);
  let history = useHistory();
  const socket = useContext(SocketContext);

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
      console.log(fetchedPlayerList);
      if (fetchedPlayerList) setPlayerList(fetchedPlayerList);
    } catch (error) {
      console.error(error);
    }
  };

  const avatarSize = useBreakpointValue({ xs: 'lg', md: 'xl', lg: '2xl' });

  const toggleCircleChat = () => {
    socket.emit('toggle-circle-chat', { value: !chatOpen, gameid: lobbyId });
  };

  useEffect(() => {
    socket.on('player-joined-circle', ({ user }) => {
      fetchPlayerList();
    });

    socket.on('player-disconnected', ({ playerName }) => {
      fetchPlayerList();
    });

    fetchPlayerList();

    return () => {
      socket.off('player-joined-circle');
      socket.off('player-disconnected');
    };
  }, []);

  return (
    <CircleInterface isHost={isHost} toggleChat={toggleChat}>
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
              <Text fontSize="1.5em" fontWeight="600">
                {player.name || <Spinner />}
              </Text>
              {!isHost && (
                <Button colorScheme="purpleButton" isFullWidth>
                  Chat
                </Button>
              )}
            </GridItem>
          ))}
        </Grid>
        {isHost && (
          <Grid
            gap={1}
            templateColumns={{ xs: 'repeat(4,1fr)', lg: 'repeat(8,1fr)' }}
          >
            <GridItem
              colSpan={{ xs: 4, lg: 8 }}
              display="flex"
              justifyContent="center"
            >
              <Text fontSize="1.5em" fontWeight="700" color="brand.offtext">
                Host Panel
              </Text>
            </GridItem>
            {chatOpen && (
              <Button onClick={toggleCircleChat} colorScheme="blueButton">
                Close Circle Chat
              </Button>
            )}
            {!chatOpen && (
              <Button onClick={toggleCircleChat} colorScheme="purpleButton">
                Open Circle Chat
              </Button>
            )}
            <Button colorScheme="purpleButton">Activity 1</Button>
            <Button colorScheme="purpleButton">Activity 1</Button>
            <Button colorScheme="purpleButton">Activity 1</Button>
            <Button colorScheme="purpleButton">Activity 1</Button>
            <Button colorScheme="purpleButton">Activity 1</Button>
            <Button colorScheme="purpleButton">Activity 1</Button>
            <Button colorScheme="purpleButton">Activity 1</Button>
          </Grid>
        )}
      </Stack>
    </CircleInterface>
  );
};

export default Home;
