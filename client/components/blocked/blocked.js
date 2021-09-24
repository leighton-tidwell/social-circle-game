import React, { useEffect } from 'react';
import { Button, Text } from '@chakra-ui/react';
import { Link, useHistory } from 'react-router-dom';
import { SplashScreenContainer } from '../../components/';

const Blocked = () => {
  let history = useHistory();
  useEffect(() => {
    history.go(0);
  }, []);
  return (
    <SplashScreenContainer>
      <Text fontSize="1.5em" fontWeight="500">
        You have been blocked!
      </Text>
      <Button
        colorScheme="purpleButton"
        isFullWidth
        fontSize="1.5em"
        height="2.5em"
        fontWeight="400"
      >
        <Link to="/game">Try again!</Link>
      </Button>
    </SplashScreenContainer>
  );
};

export default Blocked;
