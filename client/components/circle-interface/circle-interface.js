import React, { useEffect, useContext, useState } from 'react';
import { Box, Flex, Stack, StackDivider, useToast } from '@chakra-ui/react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { CircleContext } from '../../context/circle';
import axios from 'axios';
import {
  HomeIcon,
  MessageIcon,
  InboxIcon,
  ProfileIcon,
  RatingsIcon,
  DiceIcon,
} from '../../components';

const CircleInterface = ({ children }) => {
  const toast = useToast();
  const {
    isHost,
    setIsHost,
    setCircleChatOpen,
    ratingsOpen,
    setRatingsOpen,
    ratingCount,
    setRatingCount,
    socket,
    setRatedPlayers,
    setShowBlockPlayerModal,
    setInfluencerChatId,
    lobbyId,
    serverString,
    setPlayersSubmittedRatings,
    notification,
    setNotification,
  } = useContext(CircleContext);
  let history = useHistory();
  const location = useLocation();

  useEffect(() => {
    if (!lobbyId) {
      history.push('/game');
      return history.go(0);
    }

    const checkIsHost = async () => {
      try {
        const {
          data: { host },
        } = await axios.post(`${serverString}/get-host`, {
          gameid: lobbyId,
        });

        const fetchedPlayer = host[0];
        if (fetchedPlayer.socketid === socket.id && isHost !== true)
          setIsHost(true);
        else if (isHost === true && fetchedPlayer.socketid !== socket.id)
          setIsHost(false);
      } catch (error) {
        console.log(error);
      }
    };
    checkIsHost();

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
      } else {
        toast({
          title:
            'Ratings are now closed! The top two rated players are now picking a player to block!',
          position: 'top',
          isClosable: true,
          variant: 'left-accent',
        });
        setPlayersSubmittedRatings([]);
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
      const timer = setTimeout(() => {
        history.push('/game');
        history.go(0);
      }, 5000);
    });

    socket.on('new-private-chat', ({ playerName, chatid }) => {
      toast({
        title: `${playerName} has opened a new private chat with you!`,
        position: 'top',
        isClosable: true,
        variant: 'left-accent',
      });
    });

    socket.on('new-private-message', (message) => {
      if (
        message.socketid !== socket.id &&
        location.pathname !== `/game/chat/${message.chatid}`
      ) {
        console.log('Notifing');
        setNotification((notification) => notification + 1);
      }
    });

    socket.on('go-to-chat', ({ chatid }) => {
      history.push(`/game/chat/${chatid}`);
    });

    socket.on('host-new-private-chat', ({ playerNames, chatid }) => {
      if (!isHost) return;
      toast({
        title: `${playerNames.join(' and ')} have opened a new private chat!`,
        position: 'top',
        isClosable: true,
        variant: 'left-accent',
      });
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
    });

    socket.on('game-over', ({ winnerOne, winnerTwo }) => {
      toast({
        title: `The game has now concluded. ${winnerOne} and ${winnerTwo} were deemed the most popular!`,
        position: 'top',
        isClosable: true,
        variant: 'left-accent',
      });
      const timer = setTimeout(() => {
        history.push('/game');
        history.go(0);
      }, 5000);
    });

    socket.on('next-rating-last', () => {
      toast({
        title: `The next rating will be the last!`,
        position: 'top',
        isClosable: true,
        variant: 'left-accent',
      });
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
      socket.off('game-over');
      socket.off('next-rating-last');
      socket.off('new-private-message');
    };
  }, []);

  useEffect(() => {
    if (ratingsOpen) history.push('/game/ratings');
  }, [ratingsOpen]);

  return (
    <Flex
      align="center"
      justify="center"
      height="100vh"
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
              <Link to="/game/private-messages">
                <Box
                  pl={{ xs: 2, lg: 6 }}
                  pr={{ xs: 2, lg: 6 }}
                  pb={{ xs: 2, lg: 3 }}
                  pt={{ xs: 3 }}
                  position="relative"
                >
                  {notification !== 0 && (
                    <Box
                      backgroundColor="brand.main"
                      position="absolute"
                      top="5px"
                      right={{ xs: '0', md: '1em' }}
                      p={1}
                      width={{ xs: '20px', md: '25px' }}
                      height={{ xs: '20px', md: '25px' }}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      borderRadius="50px"
                      color="brand.white"
                      fontWeight="800"
                    >
                      {notification}
                    </Box>
                  )}
                  <InboxIcon
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
              {/* <Box
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
              </Box> */}
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
