import React, { useEffect, useState } from 'react';
import { Grid, GridItem, Avatar, Text, Button } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import { CircleInterface } from '../../components/';
import axios from 'axios';

const serverString = `${process.env.NEXT_PUBLIC_CIRCLE_SERVER}${
  process.env.NEXT_PUBLIC_CIRCLE_PORT
    ? `:${process.env.NEXT_PUBLIC_CIRCLE_PORT}`
    : ''
}`;

const Home = ({ lobbyId, socket, isHost }) => {
  const [playerList, setPlayerList] = useState([]);
  let history = useHistory();

  socket.on('player-joined-circle', ({ user }) => {
    history.push('/game/home');
  });

  useEffect(async () => {
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
  }, []);

  return (
    <CircleInterface socket={socket}>
      <Grid templateColumns="repeat(4, 1fr)" gap={5}>
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
            <Avatar name={player.name} src={player.profilePicture} size="2xl" />
            <Text fontSize="1.5em" fontWeight="600">
              {player.name}
            </Text>
            {!isHost && (
              <Button colorScheme="purpleButton" isFullWidth>
                Chat
              </Button>
            )}
          </GridItem>
        ))}
      </Grid>
    </CircleInterface>
  );
};

export default Home;
