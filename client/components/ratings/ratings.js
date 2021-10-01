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
import axios from 'axios';
import { CircleInterface, BlockPlayerModal } from '../../components';
import { CircleContext } from '../../context/circle';

const Ratings = () => {
  const [playerList, setPlayerList] = useState([]);
  const [ratings, setRatings] = useState([]);
  const toast = useToast();
  const {
    socket,
    isHost,
    lobbyId,
    serverString,
    ratingsOpen,
    ratingCount,
    playersSubmittedRatings,
    setPlayersSubmittedRatings,
  } = useContext(CircleContext);
  let history = useHistory();

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

  const updateRatings = (player, rating) => {
    const ratingsCopy = [...ratings];
    const index = ratings.map((rating) => rating.socketid).indexOf(player);
    if (index !== -1) {
      ratingsCopy[index] = { ...ratingsCopy[index], rating };
      return setRatings(ratingsCopy);
    }

    setRatings((previousRatings) => [
      ...previousRatings,
      { socketid: player, rating: Number(rating) },
    ]);
  };

  const submitRatings = () => {
    try {
      const arrayOfRatings = [];

      if (ratings.length !== playerList.length - 1)
        throw new Error('You must give each player a rating.');

      for (const rating of ratings) {
        if (rating.rating === '')
          throw new Error('You must give each player a rating.');
        arrayOfRatings.push(rating.rating);
      }

      const uniqueRatings = new Set(arrayOfRatings);
      if (uniqueRatings.size !== arrayOfRatings.length)
        throw new Error('You must give each player a unique rating.');
      socket.emit('submit-ratings', {
        gameid: lobbyId,
        player: socket.id,
        ratings,
        ratingCount: ratingCount,
      });
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
        ratingCount: ratingCount,
      });
      if (!listOfRatings) return;

      const playerList = listOfRatings.map((player) => player.socketid);
      if (playerList) setPlayersSubmittedRatings(playerList);
    } catch (error) {
      console.error(error);
    }
  };

  const showSpinnerOrInput = (player) => {
    // If the host, and player has not submitted show spinner
    if (isHost && !playersSubmittedRatings.includes(player.socketid))
      return <Spinner />;

    if (player.socketid === socket.id) return null;

    // If the current player has not submitted, and is not the host show rating
    if (!playersSubmittedRatings.includes(socket.id) && !isHost)
      return (
        <Select
          onChange={(event) =>
            updateRatings(player.socketid, event.target.value)
          }
          placeholder="Rate"
        >
          {playerList
            .filter((player) => player.socketid !== socket.id)
            .map((player, i) => (
              <option key={player.socketid} value={i + 1}>
                {i + 1}
              </option>
            ))}
        </Select>
      );

    // If the host and player has submitted, show Submitted
    if (isHost && playersSubmittedRatings.includes(player.socketid))
      return <Text>Submitted</Text>;

    // If the current player has submitted, and the player being mapped: show Submitted
    if (
      playersSubmittedRatings.includes(player.socketid) &&
      playersSubmittedRatings.includes(socket.id)
    )
      return <Text>Submitted</Text>;

    // If the current player has submitted, and not the player being mapped: show Spinner
    if (
      !playersSubmittedRatings.includes(player.socketid) &&
      playersSubmittedRatings.includes(socket.id)
    )
      return <Spinner />;
  };

  const finishRatings = () => {
    setPlayersSubmittedRatings([]); // Clear out the players who submitted ratings.
    socket.emit('finish-ratings', {
      gameid: lobbyId,
      ratingCount: ratingCount,
    });
  };

  const showSubmitRatingsButton = () => {
    if (!isHost && !playersSubmittedRatings.includes(socket.id) && ratingsOpen)
      return (
        <Button colorScheme="blueButton" onClick={submitRatings}>
          Submit Ratings
        </Button>
      );

    if (isHost && playersSubmittedRatings.length === playerList.length)
      return (
        <Button onClick={finishRatings} colorScheme="blueButton">
          Finish Ratings
        </Button>
      );

    if (isHost) return <Text fontWeight="800">Waiting for players...</Text>;

    if (isHost && !ratingsOpen)
      return <Text fontWeight="800">Ratings are closed.</Text>;

    return <Text fontWeight="800">Waiting for host...</Text>;
  };

  useEffect(() => {
    if (!ratingsOpen) return history.push('/game/home');

    socket.on('player-joined-circle', () => {
      fetchPlayerList();
    });

    socket.on('player-disconnected', () => {
      fetchPlayerList();
    });

    socket.on('rating-submitted', () => {
      fetchRatings();
    });

    socket.on('ratings-calculated', (sortedPlayers) => {
      setPlayerList(sortedPlayers);
    });

    fetchPlayerList();

    return () => {
      socket.off('player-joined-circle');
      socket.off('player-disconnected');
      socket.off('rating-submitted');
      socket.off('ratings-calculated');
    };
  }, []);

  return (
    <>
      <BlockPlayerModal />
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
            {playerList.map((player, i) => (
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
                {player.rating ? (
                  <Text fontSize="1.2em" fontWeight="800">
                    {i + 1}
                  </Text>
                ) : (
                  showSpinnerOrInput(player)
                )}
              </GridItem>
            ))}
          </Grid>
          {showSubmitRatingsButton()}
        </Stack>
      </CircleInterface>
    </>
  );
};

export default Ratings;
