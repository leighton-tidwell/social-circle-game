import React, { useEffect, useState, useContext, useRef } from 'react';
import { Box, Stack, Avatar, Text, Textarea, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { SocketContext } from '../../context/socket';
import { CircleInterface, SendIcon } from '../../components/';
import axios from 'axios';

const serverString = `${process.env.NEXT_PUBLIC_CIRCLE_SERVER}${
  process.env.NEXT_PUBLIC_CIRCLE_PORT
    ? `:${process.env.NEXT_PUBLIC_CIRCLE_PORT}`
    : ''
}`;

const Chat = ({ lobbyId, isHost, chatOpen, toggleChat }) => {
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const socket = useContext(SocketContext);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (event) => {
    if (!chatOpen) return; //
    console.log(chatMessage);
    setChatMessage('');
    scrollToBottom();

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
      console.log(listOfMessages);
      if (listOfMessages !== 0) setMessages(listOfMessages);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    socket.on('toggle-circle-chat', (value) => {
      scrollToBottom();
    });

    socket.on('new-circle-message', () => {
      fetchMessages();
    });

    scrollToBottom();
    fetchMessages();

    return () => {
      socket.off('toggle-circle-chat');
      socket.off('new-circle-message');
    };
  }, []);

  return (
    <CircleInterface toggleChat={toggleChat}>
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
          {messages.length !== 0 &&
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
                <Box
                  borderRadius="8px"
                  padding={2}
                  backgroundColor={
                    i % 2 === 0 && array[i - 1]?.socketid !== message.socketid
                      ? '#667EEA'
                      : '#69399A'
                  }
                >
                  <Text color="brand.white" fontWeight="800">
                    <Link to={`/game/profile/${message.socketid}`}>
                      {message.name}
                    </Link>
                  </Text>
                  <Text
                    color="brand.white"
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
          {!chatOpen && (
            <Box display="flex" justifyContent="center">
              <Text
                borderRadius="8px"
                backgroundColor="brand.white"
                fontWeight="800"
                p={2}
              >
                Circle Chat is now closed.
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
              isDisabled={!chatOpen}
            ></Textarea>
            <Button
              onClick={sendMessage}
              height="100%"
              colorScheme="blueButton"
              isDisabled={!chatOpen}
            >
              <SendIcon boxSize="2em" />
            </Button>
          </Stack>
        )}
      </Stack>
    </CircleInterface>
  );
};

export default Chat;