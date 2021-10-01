import React, { useEffect, useState, useContext, useRef } from 'react';
import {
  Box,
  Stack,
  Avatar,
  Text,
  Textarea,
  Button,
  Spinner,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { CircleContext } from '../../context/circle';
import { CircleInterface, SendIcon } from '../../components';

const Chat = () => {
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { socket, serverString, lobbyId, isHost, circleChatOpen } =
    useContext(CircleContext);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!circleChatOpen) return;
    if (chatMessage.trim() === '') return;

    setChatMessage('');
    setLoading(true);

    const {
      data: { playerData },
    } = await axios.post(`${serverString}/player-information`, {
      socketid: socket.id,
    });

    if (!playerData?.length) return;
    const fetchedPlayer = playerData[0];

    const newMessage = {
      gameid: lobbyId,
      socketid: socket.id,
      name: fetchedPlayer.name,
      message: chatMessage,
    };

    socket.emit('send-circle-chat', newMessage);
    setLoading(false);
    scrollToBottom();
  };

  const handleChangeMessage = (event) => {
    setChatMessage(event.target.value);
  };

  const fetchMessages = async () => {
    try {
      const {
        data: { listOfMessages },
      } = await axios.post(`${serverString}/get-messages`, {
        gameid: lobbyId,
      });
      if (listOfMessages !== 0) setMessages(listOfMessages);
      scrollToBottom();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    socket.on('toggle-circle-chat', () => {
      scrollToBottom();
    });

    socket.on('new-circle-message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      scrollToBottom();
    });

    scrollToBottom();
    fetchMessages();

    return () => {
      socket.off('toggle-circle-chat');
      socket.off('new-circle-message');
    };
  }, []);

  return (
    <CircleInterface>
      <Stack height="100%" spacing={2}>
        <Box
          borderRadius="8px"
          padding={5}
          backgroundColor="#63636330"
          height="90%"
          overflow="auto"
          css={{
            '&::-webkit-scrollbar': {
              display: 'none',
            },
          }}
          mt={{ xs: '5em', md: '0px' }}
        >
          {messages.length > 0 &&
            messages.map((message, i, array) => (
              <Box
                key={i}
                width="100%"
                display="flex"
                alignItems="center"
                mb={2}
              >
                <Link to={`/game/profile/${message.socketid}`}>
                  <Avatar src={message.avatar} size="lg" mr={2} />
                </Link>
                <Box borderRadius="8px" padding={2} backgroundColor="white">
                  <Text color="brand.main" fontWeight="800">
                    <Link to={`/game/profile/${message.socketid}`}>
                      {message.name}
                    </Link>
                  </Text>
                  <Text
                    color="brand.offtext"
                    sx={{
                      whiteSpace: 'normal',
                      wordWrap: 'break-all',
                      wordBreak: 'break-all',
                    }}
                  >
                    {message.message}
                  </Text>
                </Box>
              </Box>
            ))}
          {!circleChatOpen && (
            <Box display="flex" justifyContent="center">
              <Text
                borderRadius="8px"
                backgroundColor="brand.white"
                fontWeight="800"
                p={2}
              >
                Circle Chat is closed.
              </Text>
            </Box>
          )}
          <div sx={{ display: 'none' }} ref={messagesEndRef} />
        </Box>
        {!isHost && (
          <Stack direction="row">
            <Textarea
              placeholder="Send a message"
              size="md"
              resize="none"
              value={chatMessage}
              onChange={handleChangeMessage}
              isDisabled={!circleChatOpen || loading}
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  sendMessage();
                }
              }}
            />
            <Button
              onClick={sendMessage}
              height="100%"
              colorScheme="blueButton"
              isDisabled={!circleChatOpen || loading}
            >
              {loading ? <Spinner /> : <SendIcon boxSize="2em" />}
            </Button>
          </Stack>
        )}
      </Stack>
    </CircleInterface>
  );
};

export default Chat;
