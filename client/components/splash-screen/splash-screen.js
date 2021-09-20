import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@chakra-ui/react';
import { SplashScreenContainer } from '../../components/';

const SplashScreen = () => {
  return (
    <SplashScreenContainer>
      <Button
        colorScheme="blueButton"
        isFullWidth
        fontSize="1.5em"
        height="2.5em"
        fontWeight="400"
      >
        <Link to="/game/find-match">Find A Match</Link>
      </Button>
      <Button
        colorScheme="purpleButton"
        isFullWidth
        fontSize="1.5em"
        height="2.5em"
        fontWeight="400"
      >
        <Link to="/game/join-match">Join A Match</Link>
      </Button>
      <Button
        isFullWidth
        fontSize="1.5em"
        height="2.5em"
        fontWeight="400"
        as="button"
        border="1px"
        borderRadius="8px"
        color="brand.secondary"
        borderColor="brand.secondary"
        transition="all .2s ease"
        bg="brand.white"
        _hover={{
          bg: 'brand.secondary',
          color: 'brand.white',
        }}
      >
        <Link to="/game/host-match">Host A Match</Link>
      </Button>
    </SplashScreenContainer>
  );
};

export default SplashScreen;
