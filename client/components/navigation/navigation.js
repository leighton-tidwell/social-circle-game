import React from 'react';
import { Box, Flex, Spacer, Heading, Container } from '@chakra-ui/react';
import { DiscordIcon } from '..';
import Link from 'next/link.js';

const Navigation = () => (
  <Box bg="brand.white" p={2}>
    <Container maxW="container.xl">
      <Flex alignItems="center">
        <Box color="white">
          <Heading
            sx={{
              background:
                'linear-gradient(90deg,rgba(102, 126, 234, 1) 0%,rgba(105, 57, 154, 1) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
            fontSize={{ xs: '1.5em', md: '2em', lg: '3em' }}
            fontWeight="700"
          >
            The Circle
          </Heading>
        </Box>
        <Spacer />
        <Box display="flex">
          <Link href="/game">
            <Box
              as="button"
              border="1px"
              borderRadius="8px"
              color="brand.main"
              borderColor="brand.main"
              fontWeight="600"
              p={2}
              transition="all .2s ease"
              _hover={{
                bg: 'brand.main',
                color: 'brand.white',
                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
              }}
            >
              Play The Game
            </Box>
          </Link>
          <Link isExternal href="https://discord.gg/d8GWXyyPw8">
            <Box ml={2} p={2} cursor="pointer">
              <DiscordIcon
                color="brand.main"
                fill="brand.main"
                height={{ xs: '32px', lg: '40px' }}
                width={{ xs: '32px', lg: '40px' }}
              />
            </Box>
          </Link>
        </Box>
      </Flex>
    </Container>
  </Box>
);

export default Navigation;
