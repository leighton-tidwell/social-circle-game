import React, { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Box,
  Stack,
  Textarea,
  Text,
  Divider,
  Select,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
} from '@chakra-ui/react';
import { CircleContext } from '../../context/circle';
import { SendIcon } from '../../components';

const BlockPlayerModal = () => {
  const [messages, setMessages] = useState([]);
  const [enteredMessage, setEnteredMessage] = useState('');
  const [fetchedPlayerList, setFetchedPlayerList] = useState([]);
  const [winners, setWinners] = useState([]);
  const [blockedPlayer, setBlockedPlayer] = useState('');
  const [error, setError] = useState('');
  const {
    showBlockPlayerModal,
    setShowBlockPlayerModal,
    influencerChatId,
    setInfluencerChatId,
    serverString,
    lobbyId,
    socket,
  } = useContext(CircleContext);
  const messagesEndRef = useRef(null);

  const closeModal = () => {
    setError('You must select a player to block.');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const clearError = () => {
    setError('');
  };

  const handleChangeEnteredMessage = (event) => {
    setEnteredMessage(event.target.value);
  };

  const fetchPlayerList = async () => {
    try {
      const {
        data: { playerList: fetchedPlayerList },
      } = await axios.post(`${serverString}/list-players`, {
        gameid: lobbyId,
      });
      if (fetchedPlayerList) setFetchedPlayerList(fetchedPlayerList);
    } catch (error) {
      console.error(error);
    }
  };

  const updateBlockedPlayer = (event) => {
    setBlockedPlayer(event.target.value);
    socket.emit('select-block', {
      player: event.target.value,
      influencerChatId,
    });
  };

  const sendMessage = async () => {
    if (enteredMessage.trim() === '') return;
    const {
      data: { playerData },
    } = await axios.post(`${serverString}/player-information`, {
      socketid: socket.id,
    });

    if (!playerData?.length) return;
    const fetchedPlayer = playerData[0];

    const message = {
      name: fetchedPlayer.name,
      message: enteredMessage,
      influencerChatId,
    };

    socket.emit('send-influencer-message', message);
    setEnteredMessage('');
    scrollToBottom();
  };

  const blockPlayer = () => {
    socket.emit('block-player', influencerChatId, lobbyId);
    setError(null);
  };

  useEffect(() => {
    fetchPlayerList();

    socket.on('influencer-chat', ({ name, message }) => {
      setMessages((previousMessages) => [
        ...previousMessages,
        { name, message },
      ]);
      scrollToBottom();
    });

    socket.on('block-error', (message) => {
      setError(message);
    });

    socket.on('successfully-blocked-player', () => {
      setShowBlockPlayerModal(false);
      setInfluencerChatId(null);
    });

    socket.on('block-player-modal', ({ winnerOne, winnerTwo }) => {
      setWinners([winnerOne, winnerTwo]);
    });

    return () => {
      socket.off('influencer-chat');
      socket.off('block-error');
      socket.off('block-error');
    };
  }, []);

  return (
    <Modal isOpen={showBlockPlayerModal} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Influencer Chat</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack
            borderRadius="8px"
            padding={5}
            backgroundColor="#63636330"
            maxHeight={{ xs: '250px', md: '500px' }}
            overflow="auto"
            css={{
              '&::-webkit-scrollbar': {
                display: 'none',
              },
            }}
            mb={2}
          >
            <Box borderRadius="8px" padding={2} backgroundColor="white">
              <Text color="brand.main" fontWeight="800">
                The Circle
              </Text>
              <Text color="brand.offtext">
                Welcome to influencer chat! The two of you must decide which
                player gets blocked.
              </Text>
            </Box>
            {messages.map((message, i, array) => (
              <React.Fragment key={i}>
                <Box borderRadius="8px" padding={2} backgroundColor="white">
                  <Text color="brand.main" fontWeight="800">
                    {message.name}
                  </Text>
                  <Text color="brand.offtext">{message.message}</Text>
                </Box>
              </React.Fragment>
            ))}
            <div sx={{ display: 'none' }} ref={messagesEndRef} />
          </Stack>
          <Box display="flex" mb={2}>
            <Textarea
              placeholder="Send a message"
              size="sm"
              resize="none"
              mr={2}
              borderRadius="8px"
              value={enteredMessage}
              onChange={handleChangeEnteredMessage}
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  sendMessage();
                }
              }}
            />
            <Button height="5em" colorScheme="blueButton" onClick={sendMessage}>
              <SendIcon boxSize="2em" />
            </Button>
          </Box>
          <Box>
            <Select
              onChange={updateBlockedPlayer}
              value={blockedPlayer}
              placeholder="Select a Player"
            >
              {fetchedPlayerList.map((player) => {
                if (
                  player.socketid !== socket.id &&
                  !winners.includes(player.socketid)
                )
                  return <option value={player.socketid}>{player.name}</option>;
              })}
            </Select>
          </Box>
          {error && (
            <Alert status="error">
              <AlertIcon />
              <AlertTitle mr={2}>Oops! Theres a problem!</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
              <CloseButton
                onClick={clearError}
                position="absolute"
                right="8px"
                top="8px"
              />
            </Alert>
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blueButton" mr={3} onClick={blockPlayer}>
            Block Player
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BlockPlayerModal;
