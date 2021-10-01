import React, { useEffect, useContext, useState, useRef } from 'react';
import {
  Box,
  Stack,
  Text,
  Avatar,
  Heading,
  Button,
  Link,
  Divider,
} from '@chakra-ui/react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { CircleContext } from '../../context/circle';
import { CircleInterface, SendIcon } from '../../components';

const PrivateMessages = () => {
  const { socket, lobbyId, isHost, serverString, setNotification } =
    useContext(CircleContext);
  const [listOfPrivateChats, setListOfPrivateChats] = useState([]);
  let history = useHistory();

  const goToChat = (chatid) => {
    history.push(`/game/chat/${chatid}`);
  };

  useEffect(() => {
    const fetchChats = async () => {
      if (!isHost) {
        const {
          data: { userChats },
        } = await axios.post(`${serverString}/get-user-private-chats`, {
          gameid: lobbyId,
          socketid: socket.id,
        });
        if (userChats) setListOfPrivateChats(userChats);
      } else {
        const {
          data: { listOfChats },
        } = await axios.post(`${serverString}/get-private-chat-list`, {
          gameid: lobbyId,
          socketid: socket.id,
        });
        if (listOfChats) setListOfPrivateChats(listOfChats);
      }
    };

    fetchChats();
    setNotification(0);
  }, []);

  return (
    <CircleInterface>
      <Stack>
        <Heading color="brand.secondary">
          {isHost ? 'Game Private Chats' : 'Your Private Chats'}
        </Heading>
        <Box
          height="90%"
          overflow="auto"
          css={{
            '&::-webkit-scrollbar': {
              display: 'none',
            },
          }}
          mt={{ xs: '5em', md: '0px' }}
        >
          {listOfPrivateChats.map((chat) => (
            <Box
              key={chat.chatid}
              borderRadius="8px"
              padding={5}
              backgroundColor="#63636330"
              mb={2}
              display="flex"
              alignItems="center"
            >
              <Text width="90%" fontWeight="800">
                Chat with {chat.participantNames.join(' and ')}
              </Text>
              <Button
                onClick={() => goToChat(chat.chatid)}
                colorScheme="purpleButton"
              >
                Go To Chat
              </Button>
            </Box>
          ))}
          {listOfPrivateChats.length === 0 && (
            <Box
              borderRadius="8px"
              padding={5}
              backgroundColor="#63636330"
              mb={2}
              display="flex"
              alignItems="center"
            >
              <Text fontWeight="800">No private chats started!</Text>
            </Box>
          )}
        </Box>
      </Stack>
    </CircleInterface>
  );
};

export default PrivateMessages;
