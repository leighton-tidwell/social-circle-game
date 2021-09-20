import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Stack,
  Button,
  Input,
  Text,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { SplashScreenContainer } from '../../components/';

const HostMatch = () => {
  return (
    <SplashScreenContainer>
      <Box width="100%">
        <Text
          fontWeight="700"
          color="brand.offtext"
          fontSize="1.5em"
          align="left"
        >
          Match Code:
        </Text>
        <Input size="lg" value="X0dfHg" borderColor="brand.main" isReadOnly />
      </Box>

      <Button
        colorScheme="blueButton"
        isFullWidth
        fontSize="1.5em"
        height="2.5em"
        fontWeight="400"
      >
        <Link to="/game/host-match/lobby">Host Match</Link>
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

export default HostMatch;
