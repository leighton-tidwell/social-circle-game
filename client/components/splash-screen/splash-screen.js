import React from 'react';
import { Center, Box, Heading, Button, Stack } from '@chakra-ui/react';

const SplashScreen = () => (
  // Const onJoinMatch = () => {
  //   handleJoinMatch();
  // };

  // const onHostMatch = () => {
  //   handleHostMatch();
  // };

  // const onFindMatch = () => {
  //   handleFindMatch();
  // };

  <Center h="100vh" w="100%">
    <Box boxShadow="xl" bg="blue.600" borderRadius="10px" p={5}>
      <Heading align="center" color="white">
        The Circle
      </Heading>
      <Stack spacing={4} pt={5} direction="row" align="center">
        <Button colorScheme="blue" size="lg">
          Find a Match
        </Button>
        <Button colorScheme="blue" size="lg">
          Host a Match
        </Button>
        <Button colorScheme="green" size="lg">
          Join a Match
        </Button>
      </Stack>
    </Box>
  </Center>
);
export default SplashScreen;
