import React from 'react';
import { Box, Flex, Heading, Stack } from '@chakra-ui/react';

const SplashScreenContainer = ({ children }) => (
  <Flex
    align="center"
    justify="center"
    height="100vh"
    width="100vw"
    background="linear-gradient(90deg,rgba(102, 126, 234, 1) 0%,rgba(105, 57, 154, 1) 100%)"
  >
    <Box
      width={{ xs: '95%', sm: '90%', md: '70%', lg: '30%' }}
      background="brand.white"
      p={5}
      borderRadius="8px"
    >
      <Stack align="center" spacing="1.5em" p={5}>
        <Heading
          sx={{
            background:
              'linear-gradient(90deg,rgba(102, 126, 234, 1) 0%,rgba(105, 57, 154, 1) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
          fontSize="2em"
          fontWeight="700"
        >
          The Circle
        </Heading>
        {children}
      </Stack>
    </Box>
  </Flex>
);

export default SplashScreenContainer;
