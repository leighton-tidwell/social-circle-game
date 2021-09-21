import React from 'react';
import { Box, Flex, Stack, VStack, StackDivider } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import {
  HomeIcon,
  MessageIcon,
  NewsfeedIcon,
  ProfileIcon,
  RatingsIcon,
  DiceIcon,
} from '../../components/';

const CircleInterface = ({ socket, children }) => {
  let history = useHistory();

  const navigateHome = () => {
    history.push('/game/home');
  };

  const navigateProfile = () => {
    history.push(`/game/profile/${socket.id}`);
  };

  const getWindowHeight = () => {
    const doc = document.documentElement;
    doc.style.setProperty('--app-height', `${window.innerHeight}px`);
  };
  window.addEventListener('resize', getWindowHeight);
  getWindowHeight();

  return (
    <Flex
      align="center"
      justify="center"
      height="var(--app-height)"
      width="100vw"
      background="linear-gradient(90deg,rgba(102, 126, 234, 1) 0%,rgba(105, 57, 154, 1) 100%)"
    >
      <Box
        width={{ xs: '100%', md: '95%' }}
        background="brand.white"
        borderRadius={{ sm: '0px', md: '8px' }}
        height={{ xs: '100%', md: '95%', lg: '80%' }}
      >
        <Stack direction={{ xs: 'column-reverse', lg: 'row' }} height="100%">
          <Box
            borderRight={{ lg: '1px' }}
            borderTop={{ xs: '1px', lg: '0px' }}
            borderColor="brand.offtext"
            height={{ xs: 'auto', lg: '100%' }}
            display="flex"
            alignItems="center"
          >
            <Stack
              divider={<StackDivider borderColor="brand.offtext" />}
              direction={{ xs: 'row', lg: 'column' }}
              width={{ xs: '100%', lg: 'auto' }}
              display={{ xs: 'flex', lg: 'block' }}
              justifyContent="center"
            >
              <Box
                pl={{ xs: 1, lg: 6 }}
                pr={{ xs: 1, lg: 6 }}
                pb={{ xs: 1, lg: 3 }}
                pt={{ xs: 3 }}
                onClick={navigateHome}
                cursor="pointer"
              >
                <HomeIcon
                  color="brand.offtext"
                  fill="brand.offtext"
                  height={{ xs: '32px', lg: '40px' }}
                  width={{ xs: '32px', lg: '40px' }}
                />
              </Box>
              <Box
                pl={{ xs: 2, lg: 6 }}
                pr={{ xs: 2, lg: 6 }}
                pb={{ xs: 2, lg: 3 }}
                pt={{ xs: 3 }}
              >
                <MessageIcon
                  color="brand.offtext"
                  fill="brand.offtext"
                  height={{ xs: '32px', lg: '40px' }}
                  width={{ xs: '32px', lg: '40px' }}
                />
              </Box>
              <Box
                pl={{ xs: 2, lg: 6 }}
                pr={{ xs: 2, lg: 6 }}
                pb={{ xs: 2, lg: 3 }}
                pt={{ xs: 3 }}
              >
                <NewsfeedIcon
                  color="brand.offtext"
                  fill="brand.offtext"
                  height={{ xs: '32px', lg: '40px' }}
                  width={{ xs: '32px', lg: '40px' }}
                />
              </Box>
              <Box
                pl={{ xs: 2, lg: 6 }}
                pr={{ xs: 2, lg: 6 }}
                pb={{ xs: 2, lg: 3 }}
                pt={{ xs: 3 }}
                onClick={navigateProfile}
                cursor="pointer"
              >
                <ProfileIcon
                  color="brand.offtext"
                  fill="brand.offtext"
                  height={{ xs: '32px', lg: '40px' }}
                  width={{ xs: '32px', lg: '40px' }}
                />
              </Box>
              <Box
                pl={{ xs: 2, lg: 6 }}
                pr={{ xs: 2, lg: 6 }}
                pb={{ xs: 2, lg: 3 }}
                pt={{ xs: 3 }}
              >
                <RatingsIcon
                  color="brand.offtext"
                  fill="brand.offtext"
                  height={{ xs: '32px', lg: '40px' }}
                  width={{ xs: '32px', lg: '40px' }}
                />
              </Box>
              <Box
                pl={{ xs: 2, lg: 6 }}
                pr={{ xs: 2, lg: 6 }}
                pb={{ xs: 2, lg: 3 }}
                pt={{ xs: 3 }}
              >
                <DiceIcon
                  color="brand.offtext"
                  fill="brand.offtext"
                  height={{ xs: '32px', lg: '40px' }}
                  width={{ xs: '32px', lg: '40px' }}
                />
              </Box>
            </Stack>
          </Box>
          <Box
            p={{ xs: 5, sm: 5, md: 10 }}
            width="100%"
            height={['100%', null, '100%', null, 'auto']}
          >
            {children}
          </Box>
        </Stack>
      </Box>
    </Flex>
  );
};

export default CircleInterface;
