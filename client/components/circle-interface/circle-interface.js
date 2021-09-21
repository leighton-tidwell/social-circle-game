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
      minHeight="-webkit-fill-available"
      background="linear-gradient(90deg,rgba(102, 126, 234, 1) 0%,rgba(105, 57, 154, 1) 100%)"
    >
      <Box
        width={['100%', null, '95%', null, '95%']}
        background="brand.white"
        borderRadius="8px"
        height={['100%', null, '95%', null, '80%']}
      >
        <Stack
          direction={['column-reverse', null, 'column-reverse', null, 'row']}
          height="100%"
        >
          <Box
            borderRight={[null, null, null, null, '1px']}
            borderTop={['1px', null, '1px', null, null]}
            borderColor="brand.offtext"
            height={['auto', null, 'auto', null, '100%']}
            display="flex"
            alignItems="center"
          >
            <Stack
              divider={<StackDivider borderColor="brand.offtext" />}
              direction={['row', null, 'row', null, 'column']}
              width={['100%', null, '100%', null, 'auto']}
              display={['flex', null, 'flex', null, 'block']}
              justifyContent="center"
            >
              <Box
                pl={[1, null, 1, null, 6]}
                pr={[1, null, 1, null, 6]}
                pb={[1, null, 1, null, 3]}
                pt={[3, null, 3, null, 3]}
                onClick={navigateHome}
                cursor="pointer"
              >
                <HomeIcon
                  color="brand.offtext"
                  fill="brand.offtext"
                  height={['30px', null, '30px', null, '40px']}
                  width={['30px', null, '30px', null, '40px']}
                />
              </Box>
              <Box
                pl={[1, null, 1, null, 6]}
                pr={[1, null, 1, null, 6]}
                pb={[1, null, 1, null, 3]}
                pt={[3, null, 3, null, 3]}
              >
                <MessageIcon
                  color="brand.offtext"
                  fill="brand.offtext"
                  height={['30px', null, '30px', null, '40px']}
                  width={['30px', null, '30px', null, '40px']}
                />
              </Box>
              <Box
                pl={[1, null, 1, null, 6]}
                pr={[1, null, 1, null, 6]}
                pb={[1, null, 1, null, 3]}
                pt={[3, null, 3, null, 3]}
              >
                <NewsfeedIcon
                  color="brand.offtext"
                  fill="brand.offtext"
                  height={['30px', null, '30px', null, '40px']}
                  width={['30px', null, '30px', null, '40px']}
                />
              </Box>
              <Box
                pl={[1, null, 1, null, 6]}
                pr={[1, null, 1, null, 6]}
                pb={[1, null, 1, null, 3]}
                pt={[3, null, 3, null, 3]}
                onClick={navigateProfile}
                cursor="pointer"
              >
                <ProfileIcon
                  color="brand.offtext"
                  fill="brand.offtext"
                  height={['30px', null, '30px', null, '40px']}
                  width={['30px', null, '30px', null, '40px']}
                />
              </Box>
              <Box
                pl={[1, null, 1, null, 6]}
                pr={[1, null, 1, null, 6]}
                pb={[1, null, 1, null, 3]}
                pt={[3, null, 3, null, 3]}
              >
                <RatingsIcon
                  color="brand.offtext"
                  fill="brand.offtext"
                  height={['30px', null, '30px', null, '40px']}
                  width={['30px', null, '30px', null, '40px']}
                />
              </Box>
              <Box
                pl={[1, null, 1, null, 6]}
                pr={[1, null, 1, null, 6]}
                pb={[1, null, 1, null, 3]}
                pt={[3, null, 3, null, 3]}
              >
                <DiceIcon
                  color="brand.offtext"
                  fill="brand.offtext"
                  height={['30px', null, '30px', null, '40px']}
                  width={['30px', null, '30px', null, '40px']}
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
