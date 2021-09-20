import React, { useState } from 'react';
import { Button, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { Link, useHistory } from 'react-router-dom';
import { SendIcon, SplashScreenContainer } from '../../components/';

const JoinMatch = ({ socket, onLobbyChange }) => {
  const [matchCode, setMatchCode] = useState('');
  let history = useHistory();

  const handleMatchCodeChange = (event) => {
    setMatchCode(event.target.value);
  };

  socket.on('join-match', () => {
    onLobbyChange(matchCode);
    return history.push('/game/host-match/lobby');
  });

  socket.on('failed-join', ({ reason }) => {
    if (reason === 'full') return alert('This lobby is full.');
  });

  const handleJoinMatch = () => {
    socket.emit('join-match', matchCode);
  };

  return (
    <SplashScreenContainer>
      <InputGroup>
        <Input
          size="lg"
          placeholder="Enter match code"
          borderColor="brand.main"
          onChange={handleMatchCodeChange}
        />
        <InputRightElement>
          <Button
            colorScheme="blueButton"
            borderTopLeftRadius="0px"
            borderBottomLeftRadius="0px"
            size="lg"
            mt={2}
            mr={2}
            onClick={handleJoinMatch}
          >
            <SendIcon boxSize="2em" />
          </Button>
        </InputRightElement>
      </InputGroup>

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

export default JoinMatch;
