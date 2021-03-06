import React, { useState, useEffect, useContext } from 'react';
import { Button, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { Link, useHistory } from 'react-router-dom';
import {
  SendIcon,
  SplashScreenContainer,
  SetupProfile,
} from '../../components';
import { CircleContext } from '../../context/circle';

const JoinMatch = () => {
  const [matchCode, setMatchCode] = useState('');
  const [profileSetup, setProfileSetup] = useState(false);
  const { setLobbyId, socket } = useContext(CircleContext);
  let history = useHistory();

  const handleMatchCodeChange = (event) => {
    setMatchCode(event.target.value);
  };

  const handleJoinMatch = () => {
    if (matchCode && profileSetup)
      socket.emit('join-match', matchCode.toUpperCase());
  };

  useEffect(() => {
    socket.on('join-match', (gameid) => {
      setLobbyId(gameid);
      history.push('/game/host-match/lobby');
    });

    socket.on('failed-join', ({ reason }) => {
      if (reason === 'full') alert('This lobby is full.');
    });

    return () => {
      socket.off('join-match');
      socket.off('failed-join');
    };
  }, []);

  return (
    <SplashScreenContainer>
      {profileSetup ? (
        <>
          <InputGroup>
            <Input
              size="lg"
              placeholder="Enter match code"
              borderColor="brand.main"
              onChange={handleMatchCodeChange}
              value={matchCode}
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
          <Link style={{ width: '100%' }} to="/game">
            <Button
              colorScheme="purpleButton"
              isFullWidth
              fontSize="1.5em"
              height="2.5em"
              fontWeight="400"
            >
              Cancel
            </Button>
          </Link>
        </>
      ) : (
        <SetupProfile onProfileSave={setProfileSetup} />
      )}
    </SplashScreenContainer>
  );
};

export default JoinMatch;
