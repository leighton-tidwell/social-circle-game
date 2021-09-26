import React, { useEffect, useContext } from 'react';
import { Box, Flex, Stack, StackDivider, useToast } from '@chakra-ui/react';
import { Link, useHistory } from 'react-router-dom';
import { CircleContext } from '../../context/circle';
import {
  HomeIcon,
  MessageIcon,
  NewsfeedIcon,
  ProfileIcon,
  RatingsIcon,
  DiceIcon,
} from '../../components';

const CircleInterface = ({ children }) => {
  const toast = useToast();
  const {
    isHost,
    setCircleChatOpen,
    ratingsOpen,
    setRatingsOpen,
    setRatingCount,
    socket,
    setRatedPlayers,
    setShowBlockPlayerModal,
    setInfluencerChatId,
    lobbyId,
    setLobbyId,
    setProfileSetupCount,
  } = useContext(CircleContext);
  const history = useHistory();

  const getWindowHeight = () => {
    const doc = document.documentElement;
    doc.style.setProperty('--app-height', `${window.innerHeight}px`);
  };

  window.addEventListener('resize', getWindowHeight);
  getWindowHeight();

  useEffect(() => {
    if (!lobbyId) {
      history.push('/game');
      return history.go(0);
    }

    socket.on('player-joined-circle', () => {
      setProfileSetupCount((previousCount) => previousCount + 1);
      // Toast({
      //   title: 'A new player has joined!',
      //   position: 'top',
      //   isClosable: true,
      //   variant: 'left-accent',
      // });
    });

    socket
      .off('player-disconnected')
      .on('player-disconnected', ({ playerName }) => {
        toast({
          title: `${playerName} has been disconnected!`,
          position: 'top',
          isClosable: true,
          variant: 'left-accent',
        });
      });

    socket.on('toggle-circle-chat', (status) => {
      if (status)
        toast({
          title: 'Circle chat is now open!',
          position: 'top',
          isClosable: true,
          variant: 'left-accent',
        });
      else
        toast({
          title: 'Circle chat is now closed!',
          position: 'top',
          isClosable: true,
          variant: 'left-accent',
        });
      setCircleChatOpen(status);
    });

    socket.on('toggle-ratings', (status) => {
      if (status) {
        toast({
          title: 'Ratings are now open!',
          position: 'top',
          isClosable: true,
          variant: 'left-accent',
        });
        history.push('/game/ratings');
      } else {
        toast({
          title: 'Ratings are now closed!',
          position: 'top',
          isClosable: true,
          variant: 'left-accent',
        });
        setRatingCount((previousCount) => previousCount + 1);
      }

      setRatingsOpen(status);
    });

    socket.on('host-disconnect', () => {
      toast({
        title:
          'The host has disconnected, you will be sent back to the match screen.',
        position: 'top',
        isClosable: true,
        variant: 'left-accent',
      });
      history.push('/game');
      history.go(0);
    });

    socket.on('new-private-chat', ({ playerName, chatid }) => {
      toast({
        title: `${playerName} has opened a new private chat with you!`,
        position: 'top',
        isClosable: true,
        variant: 'left-accent',
      });
      history.push(`/game/chat/${chatid}`);
    });

    socket.on('host-new-private-chat', ({ playerNames, chatid }) => {
      if (!isHost) return;
      toast({
        title: `${playerNames.join(',')} have opened a new private chat!`,
        position: 'top',
        isClosable: true,
        variant: 'left-accent',
      });
      history.push(`/game/chat/${chatid}`);
    });

    socket.on('ratings-calculated', (sortedScores) => {
      setRatedPlayers(sortedScores);
    });

    socket.on('block-player-modal', ({ influencerChat }) => {
      setInfluencerChatId(influencerChat);
      setShowBlockPlayerModal(true);
      socket.emit('toggle-ratings', { value: !ratingsOpen, gameid: lobbyId });
    });

    socket.on('blocked', () => {
      setLobbyId(null);
      history.push('/game/blocked');
    });

    socket.on('blocked-player', (name) => {
      history.push('/game/home');
      toast({
        title: `${name} has been blocked from the circle!`,
        position: 'top',
        isClosable: true,
        variant: 'left-accent',
      });
      setProfileSetupCount((previousCount) => previousCount - 1);
    });

    return () => {
      socket.off('player-joined-circle');
      socket.off('player-disconnected');
      socket.off('toggle-circle-chat');
      socket.off('host-disconnect');
      socket.off('new-private-chat');
      socket.off('host-new-private-chat');
      socket.off('toggle-ratings');
      socket.off('finish-ratings');
      socket.off('block-player-modal');
      socket.off('blocked');
      socket.off('blocked-player');
    };
  }, []);

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
              <Link to="/game/home">
                <Box
                  pl={{ xs: 1, lg: 6 }}
                  pr={{ xs: 1, lg: 6 }}
                  pb={{ xs: 1, lg: 3 }}
                  pt={{ xs: 3 }}
                >
                  <HomeIcon
                    color="brand.offtext"
                    fill="brand.offtext"
                    height={{ xs: '32px', lg: '40px' }}
                    width={{ xs: '32px', lg: '40px' }}
                  />
                </Box>
              </Link>
              <Link to="/game/chat">
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
              </Link>
              <Link to="/game/newsfeed">
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
              </Link>
              {!isHost && (
                <Link to={`/game/profile/${socket.id}`}>
                  <Box
                    pl={{ xs: 2, lg: 6 }}
                    pr={{ xs: 2, lg: 6 }}
                    pb={{ xs: 2, lg: 3 }}
                    pt={{ xs: 3 }}
                  >
                    <ProfileIcon
                      color="brand.offtext"
                      fill="brand.offtext"
                      height={{ xs: '32px', lg: '40px' }}
                      width={{ xs: '32px', lg: '40px' }}
                    />
                  </Box>
                </Link>
              )}
              {ratingsOpen && (
                <Link to="/game/ratings">
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
                </Link>
              )}
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
            overflow="auto"
          >
            {children}
          </Box>
        </Stack>
      </Box>
    </Flex>
  );
};

export default CircleInterface;
