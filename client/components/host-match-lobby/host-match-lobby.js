import React from 'react';
import { Button, Text, Spinner, List, ListItem, Box } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { SplashScreenContainer } from '../../components/';

const HostMatchLobby = () => {
  return (
    <SplashScreenContainer>
      <Text fontSize="1.5em" fontWeight="500">
        Waiting for players <Spinner />
      </Text>
      <Box textAlign="left" width="100%">
        <List spacing={1}>
          <ListItem fontSize="1.2em" fontWeight="600" color="brand.offtext">
            Player 1
          </ListItem>
          <ListItem fontSize="1.2em" fontWeight="600" color="brand.offtext">
            Player 2
          </ListItem>
          <ListItem fontSize="1.2em" fontWeight="600" color="brand.offtext">
            Player 3
          </ListItem>
          <ListItem fontSize="1.2em" fontWeight="600" color="brand.offtext">
            Player 4
          </ListItem>
        </List>
      </Box>
      <Button
        colorScheme="blueButton"
        isFullWidth
        fontSize="1.5em"
        height="2.5em"
        fontWeight="400"
      >
        <Link to="/game">Start Game</Link>
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

export default HostMatchLobby;
