import React from 'react';
import { Box, Flex, Stack, VStack, StackDivider } from '@chakra-ui/react';
import {
  HomeIcon,
  MessageIcon,
  NewsfeedIcon,
  ProfileIcon,
  RatingsIcon,
  DiceIcon,
} from '../../components/';

const CircleInterface = ({ children }) => {
  return (
    <Flex
      align="center"
      justify="center"
      height="100vh"
      width="100vw"
      background="linear-gradient(90deg,rgba(102, 126, 234, 1) 0%,rgba(105, 57, 154, 1) 100%)"
    >
      <Box width="95%" background="brand.white" borderRadius="8px" height="80%">
        <Stack direction="row" height="100%">
          <Box
            borderRight="1px"
            borderColor="brand.offtext"
            height="100%"
            display="flex"
            alignItems="center"
          >
            <VStack divider={<StackDivider borderColor="brand.offtext" />}>
              <Box pl={6} pr={6} pb={3} pt={3}>
                <HomeIcon
                  color="brand.offtext"
                  fill="brand.offtext"
                  height="40px"
                  width="40px"
                />
              </Box>
              <Box pl={6} pr={6} pb={3} pt={3}>
                <MessageIcon
                  color="brand.offtext"
                  fill="brand.offtext"
                  height="40px"
                  width="40px"
                />
              </Box>
              <Box pl={6} pr={6} pb={3} pt={3}>
                <NewsfeedIcon
                  color="brand.offtext"
                  fill="brand.offtext"
                  height="40px"
                  width="40px"
                />
              </Box>
              <Box pl={6} pr={6} pb={3} pt={3}>
                <ProfileIcon
                  color="brand.offtext"
                  fill="brand.offtext"
                  height="40px"
                  width="40px"
                />
              </Box>
              <Box pl={6} pr={6} pb={3} pt={3}>
                <RatingsIcon
                  color="brand.offtext"
                  fill="brand.offtext"
                  height="40px"
                  width="40px"
                />
              </Box>
              <Box pl={6} pr={6} pb={3} pt={3}>
                <DiceIcon
                  color="brand.offtext"
                  fill="brand.offtext"
                  height="40px"
                  width="40px"
                />
              </Box>
            </VStack>
          </Box>
          <Box p={10} width="100%">
            {children}
          </Box>
        </Stack>
      </Box>
    </Flex>
  );
};

export default CircleInterface;
