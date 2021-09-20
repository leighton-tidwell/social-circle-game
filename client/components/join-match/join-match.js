import React from 'react';
import { Button, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { SendIcon, SplashScreenContainer } from '../../components/';

const JoinMatch = () => {
  return (
    <SplashScreenContainer>
      <InputGroup>
        <Input
          size="lg"
          placeholder="Enter match code"
          borderColor="brand.main"
        />
        <InputRightElement>
          <Button
            colorScheme="blueButton"
            borderTopLeftRadius="0px"
            borderBottomLeftRadius="0px"
            size="lg"
            mt={2}
            mr={2}
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
