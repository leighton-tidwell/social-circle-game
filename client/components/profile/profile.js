import React, { useEffect, useState, useContext } from 'react';
import { Box, Stack, Text } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { CircleInterface } from '../../components';
import { CircleContext } from '../../context/circle';

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: '',
    age: '',
    relationshipStatus: '',
    bio: '',
    profilePicture: '',
  });
  const { id } = useParams();
  const { socket, serverString } = useContext(CircleContext);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      const {
        data: { playerData },
      } = await axios.post(`${serverString}/player-information`, {
        socketid: id,
      });

      if (!playerData) return;
      if (playerData.length > 0) {
        const fetchedPlayer = playerData[0];
        setProfileData({
          name: fetchedPlayer.name,
          age: fetchedPlayer.age,
          relationshipStatus: fetchedPlayer.relationshipStatus,
          bio: fetchedPlayer.bio,
          profilePicture: fetchedPlayer.profilePicture,
        });
      }
    };

    fetchData();
  }, []);

  return (
    <CircleInterface>
      <Stack
        direction={{ xs: 'column', sm: 'column', md: 'row' }}
        height="100%"
        width="100%"
        spacing="2em"
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          backgroundColor="rgba(99,99,99,.17)"
          height="100%"
          width={{ xs: '100%', sm: '100%', md: '50%' }}
          backgroundImage={
            profileData.profilePicture
              ? `url(${profileData.profilePicture})`
              : ''
          }
          backgroundPosition="center center"
          backgroundSize="cover"
        />
        <Stack direction="column" width={{ xs: '100%', sm: '100%', md: '50%' }}>
          <Text fontSize="2em" fontWeight="800">
            {profileData.name}
          </Text>
          <Text fontSize="1.5em">
            <b>Age:</b> {profileData.age}
          </Text>
          <Text fontSize="1.5em">
            <b>Relationship Status:</b> {profileData.relationshipStatus}
          </Text>
          <Text fontSize="1.5em">
            <b>Bio:</b> {profileData.bio}
          </Text>
        </Stack>
      </Stack>
    </CircleInterface>
  );
};

export default Profile;
