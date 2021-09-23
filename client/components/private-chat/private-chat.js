import React, { useEffect, useContext, useState, useRef } from 'react';
import {
  Box,
  Stack,
  Avatar,
  Text,
  Textarea,
  Button,
  Link,
} from '@chakra-ui/react';
import { SocketContext } from '../../context/socket';
import { CircleInterface, SendIcon } from '../../components/';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const serverString = `${process.env.NEXT_PUBLIC_CIRCLE_SERVER}${
  process.env.NEXT_PUBLIC_CIRCLE_PORT
    ? `:${process.env.NEXT_PUBLIC_CIRCLE_PORT}`
    : ''
}`;

const PrivateChat = ({ lobbyId, isHost, toggleChat, toggleRatings }) => {
  const socket = useContext(SocketContext);
  const { id } = useParams();
  const messagesEndRef = useRef(null);

  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (event) => {
    console.log(chatMessage);

    const {
      data: { playerData },
    } = await axios.post(`${serverString}/player-information`, {
      socketid: socket.id,
    });

    if (!playerData?.length) return;
    const fetchedPlayer = playerData[0];

    const newMessage = {
      socketid: socket.id,
      chatid: id,
      name: fetchedPlayer.name,
      message: chatMessage,
    };

    setChatMessage('');
    scrollToBottom();
    socket.emit('send-private-chat', newMessage);
  };

  const handleChangeMessage = (event) => {
    setChatMessage(event.target.value);
  };

  const fetchMessages = async () => {
    try {
      const {
        data: { listOfMessages },
      } = await axios.post(`${serverString}/get-private-messages`, {
        gameid: lobbyId,
        chatid: id,
      });
      console.log(listOfMessages);
      if (listOfMessages !== 0) setMessages(listOfMessages);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchParticipants = async () => {
    try {
      const {
        data: { listOfParticipants },
      } = await axios.post(`${serverString}/get-chat-participants`, {
        gameid: lobbyId,
        chatid: id,
      });
      if (listOfParticipants !== 0)
        setParticipants(listOfParticipants[0].participantNames);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchParticipants();
    scrollToBottom();

    socket.on('new-private-message', () => {
      fetchMessages();
    });
    return () => {
      socket.off('new-private-message');
    };
  }, []);

  return (
    <CircleInterface toggleChat={toggleChat} toggleRatings={toggleRatings}>
      <Stack height="100%" spacing={2}>
        <Text fontWeight="800">{participants?.join(' and ')}</Text>
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
            ></Textarea>
            <Button
              onClick={sendMessage}
              height="100%"
              colorScheme="blueButton"
            >
              <SendIcon boxSize="2em" />
            </Button>
          </Stack>
        )}
      </Stack>
    </CircleInterface>
  );
};

export default PrivateChat;
