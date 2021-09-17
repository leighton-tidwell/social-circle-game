import React from 'react';
import { Box, Container, Flex, Heading, Text } from '@chakra-ui/react';
import Link from 'next/link';

const Hero = () => (
  <Box
    sx={{
      background:
        'url(/assets/hero.png), linear-gradient(180deg,rgba(102, 126, 234, 1) 0%,rgba(105, 57, 154, 1) 100%)',
    }}
    color="white"
    bg="brand.300"
    height="25em"
  >
    <Container maxW="container.sm" height="100%">
      <Flex
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        height="100%"
      >
        <Heading fontWeight="800">Can you be</Heading>
        <Heading fontWeight="300" mt={2}>
          the most popular?
        </Heading>
        <Text textAlign="center" mt={4}>
          The Circle is a game where players compete with one another to become
          the most popular. Those not deemed popular by the group are{' '}
          <b>blocked</b>.
        </Text>
        <Link href="/game">
          <Box
            as="button"
            borderRadius="8px"
            color="brand.white"
            borderColor="brand.main"
            fontSize={['1.5em', null, '3em']}
            fontWeight="600"
            mt={5}
            mb={5}
            height="2em"
            width="10em"
            boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
            transition="all .2s ease"
            sx={{
              background:
                'linear-gradient(320deg, rgba(102, 126, 234, 1) 0%,rgba(105, 57, 154, 1) 100%)',
            }}
            _hover={{
              bg: 'linear-gradient(90deg, rgba(102, 126, 234, 1) 0%,rgba(105, 57, 154, 1) 100%)',
              transform: 'scale(1.2)',
            }}
          >
            Play The Game
          </Box>
        </Link>
      </Flex>
    </Container>
  </Box>
);

export default Hero;
