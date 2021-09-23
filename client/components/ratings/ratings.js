import React, { useEffect, useState, useContext } from 'react';
import {
  Grid,
  GridItem,
  Avatar,
  Text,
  Select,
  Stack,
  Button,
  useToast,
  Spinner,
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

const Ratings = ({ isHost, toggleRatings, toggleChat, lobbyId }) => {
  const [playerList, setPlayerList] = useState([]);
  const [playersSubmittedRatings, setPlayersSubmittedRatings] = useState([]);
  const [ratings, setRatings] = useState([]);
  let history = useHistory();
  const toast = useToast();
  const socket = useContext(SocketContext);

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

  const updateRatings = (player, rating) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [player]: rating,
    }));
  };

  const submitRatings = () => {
    try {
      let arrayOfRatings = [];
      for (const player in ratings) {
        arrayOfRatings.push(ratings[player]);
      }
      const uniqueRatings = new Set(arrayOfRatings);

      if (uniqueRatings.size !== arrayOfRatings.length)
        throw new Error('You must give each player a unique rating!');

      socket.emit('submit-ratings', {
        gameid: lobbyId,
        player: socket.id,
        ratings,
      });
      // Now we can emit the ratings via socket
    } catch (error) {
      toast({
        title: error.message,
        position: 'top',
        isClosable: true,
        status: 'error',
        variant: 'left-accent',
      });
    }
  };

  const fetchRatings = async () => {
    try {
      const {
        data: { listOfRatings },
      } = await axios.post(`${serverString}/get-ratings`, {
        gameid: lobbyId,
      });
      if (!listOfRatings) return;

      const playerList = listOfRatings.map((player) => player.socketid);
      if (playerList) setPlayersSubmittedRatings(playerList);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    socket.on('player-joined-circle', ({ user }) => {
      fetchPlayerList();
    });

    socket.on('player-disconnected', ({ playerName }) => {
      fetchPlayerList();
    });

    socket.on('rating-submitted', () => {
      fetchRatings();
    });

    fetchPlayerList();

    return () => {
      socket.off('player-joined-circle');
      socket.off('player-disconnected');
      socket.off('rating-submitted');
    };
  }, []);

  useEffect(() => {
    console.log(ratings);
  }, [ratings]);

  return (
    <CircleInterface
      isHost={isHost}
      toggleRatings={toggleRatings}
      toggleChat={toggleChat}
    >
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
                cursor="pointer"
                borderColor="brand.main"
                showBorder
              />
              <Text fontSize="1.5em" fontWeight="600">
                {player.name}
              </Text>
              {(isHost && !playersSubmittedRatings.includes(player.socketid)) ||
                (!isHost && playersSubmittedRatings.includes(socket.id) && (
                  <Spinner />
                ))}
              {playersSubmittedRatings.includes(player.socketid) && (
                <Text fontWeight="800">Submitted</Text>
              )}
              {!isHost && !playersSubmittedRatings.includes(socket.id) && (
                <Select
                  onChange={(event) =>
                    updateRatings(player.socketid, event.target.value)
                  }
                  placeholder="Rate"
                >
                  {playerList.map((player, i) => (
                    <option value={i + 1}>{i + 1}</option>
                  ))}
                </Select>
              )}
            </GridItem>
          ))}
        </Grid>
        {!isHost && (
          <Button onClick={submitRatings} colorScheme="blueButton">
            Submit Ratings
          </Button>
        )}
      </Stack>
    </CircleInterface>
  );
};

export default Ratings;
