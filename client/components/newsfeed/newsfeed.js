import React, { useEffect, useState, useContext } from 'react';
import { Box, Stack, Text } from '@chakra-ui/react';
import axios from 'axios';
import { CircleContext } from '../../context/circle';
import { CircleInterface } from '../../components';

const Newsfeed = () => {
  const [newsFeedList, setNewsFeedList] = useState([]);
  const { socket, serverString, lobbyId } = useContext(CircleContext);

  const fetchNewsfeed = async () => {
    try {
      const {
        data: { newsFeed },
      } = await axios.post(`${serverString}/get-newsfeed`, {
        gameid: lobbyId,
      });
      if (newsFeed !== 0) setNewsFeedList(newsFeed);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchNewsfeed();
  }, []);

  return (
    <CircleInterface>
      <Stack
        color="brand.white"
        height="100%"
        spacing={2}
        overflow="auto"
        css={{
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >
        <Box backgroundColor="brand.main" p={2} borderRadius="8px">
          <Text fontWeight="800">Name</Text>
          <Text>
            Post postPost postPost postPost postPost postPost postPost postPost
            postPost postPost postPost postPost postPost postPost postPost
            postPost postPost postPost postPost postPost postPost postPost
            postPost postPost postPost postPost postPost post
          </Text>
        </Box>
        <Box backgroundColor="brand.secondary" p={2} borderRadius="8px">
          <Text>Name</Text>
          <Text>
            Post postPost postPost postPost postPost postPost postPost postPost
            postPost postPost postPost postPost postPost postPost postPost
            postPost postPost postPost postPost postPost postPost postPost
            postPost postPost postPost postPost postPost post
          </Text>
        </Box>
        <Box backgroundColor="brand.main" p={2} borderRadius="8px">
          <Text fontWeight="800">Name</Text>
          <Text>
            Post postPost postPost postPost postPost postPost postPost postPost
            postPost postPost postPost postPost postPost postPost postPost
            postPost postPost postPost postPost postPost postPost postPost
            postPost postPost postPost postPost postPost post
          </Text>
        </Box>
        <Box backgroundColor="brand.secondary" p={2} borderRadius="8px">
          <Text>Name</Text>
          <Text>
            Post postPost postPost postPost postPost postPost postPost postPost
            postPost postPost postPost postPost postPost postPost postPost
            postPost postPost postPost postPost postPost postPost postPost
            postPost postPost postPost postPost postPost post
          </Text>
        </Box>
      </Stack>
    </CircleInterface>
  );
};

export default Newsfeed;
