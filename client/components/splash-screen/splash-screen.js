import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@chakra-ui/react';
import { SplashScreenContainer } from '../../components';

const SplashScreen = () => (
  <SplashScreenContainer>
    <Link style={{ width: '100%' }} to="/game/find-match">
      <Button
        colorScheme="blueButton"
        isFullWidth
        fontSize="1.5em"
        height="2.5em"
        fontWeight="400"
      >
        Find A match
      </Button>
    </Link>
    <Link style={{ width: '100%' }} to="/game/join-match">
      <Button
        colorScheme="purpleButton"
        isFullWidth
        fontSize="1.5em"
        height="2.5em"
        fontWeight="400"
      >
        Join A match
      </Button>
    </Link>
    <Link style={{ width: '100%' }} to="/game/host-match">
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
        Host A Match
      </Button>
    </Link>
  </SplashScreenContainer>
);

export default SplashScreen;
