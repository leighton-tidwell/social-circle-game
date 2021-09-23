import React, { useEffect, useState, useContext } from 'react';
import {
  Box,
  Stack,
  Text,
  Input,
  Textarea,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  Spinner,
} from '@chakra-ui/react';
import { useHistory, useParams } from 'react-router-dom';
import { CircleInterface } from '../../components/';
import { CircleContext } from '../../context/circle';
import axios from 'axios';

const Profile = ({ editable, match, ...props }) => {
  const [profileData, setProfileData] = useState({
    name: '',
    age: '',
    relationshipStatus: '',
    bio: '',
    profilePicture: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const { lobbyId, socket, serverString } = useContext(CircleContext);
  let history = useHistory();

  const openImageUpload = () => {
    document.getElementById('profile-upload').click();
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.addEventListener('load', () => {
        return resolve(reader.result?.slice(reader.result?.indexOf(',') + 1));
      });
      reader.addEventListener('error', () => {
        return reject(new Error('File could not be parsed'));
      });
    });

  const hasMinPicDimension = ({ mimeType, base64, file }) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.src = `data:${mimeType};base64,${base64}`;
      image.addEventListener('load', () => {
        if (!['image/gif', 'image/jpeg', 'image/png'].includes(mimeType)) {
          return reject(new Error('Image is not a supported type'));
        }

        if (image.height >= 151 && image.width >= 151) {
          return resolve({ mimeType, base64, file });
        }

        return reject(new Error('Image is too small'));
      });

      image.addEventListener('error', () => {
        reject(new Error('File is not an image'));
      });
    });

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    try {
      if (file) {
        const fileData = {
          mimeType: file.type,
          base64: await getBase64(file),
          file,
        };

        await hasMinPicDimension(fileData);
        setProfileData((prevData) => ({
          ...prevData,
          profilePicture: `data:${fileData.mimeType};base64,${fileData.base64}`,
        }));
        setError('');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleNameChange = (event) => {
    setProfileData((prevData) => ({ ...prevData, name: event.target.value }));
    setError('');
  };

  const handleAgeChange = (event) => {
    setProfileData((prevData) => ({ ...prevData, age: event.target.value }));
    setError('');
  };

  const handleRelationshipChange = (event) => {
    setProfileData((prevData) => ({
      ...prevData,
      relationshipStatus: event.target.value,
    }));
    setError('');
  };

  const handleBioChange = (event) => {
    setProfileData((prevData) => ({ ...prevData, bio: event.target.value }));
    setError('');
  };

  const clearError = () => {
    setError('');
  };

  const handleSubmit = () => {
    if (!profileData.name) return setError('Name is missing!');
    if (!profileData.age) return setError('Age is missing!');
    if (!profileData.relationshipStatus)
      return setError('Relationship status is missing!');
    if (!profileData.bio) return setError('Bio is missing!');
    if (!profileData.profilePicture)
      return setError('You forgot a profile picture!');

    const user = {
      gameid: lobbyId,
      socketid: socket.id,
      ...profileData,
    };
    socket.emit('save-profile', user);
    setLoading(true);
  };

  const isErrorField = (field) => {
    if (error.toLowerCase().indexOf(field) === -1) return false;
    return true;
  };

  useEffect(async () => {
    socket.on('profile-saved-successfully', () => {
      return history.push(`/game/profile/${socket.id}`);
    });
    if (!id) return;

    const {
      data: { playerData },
    } = await axios.post(`${serverString}/player-information`, {
      socketid: id,
    });

    if (!playerData) return;
    if (playerData.length !== 0) {
      const fetchedPlayer = playerData[0];
      setProfileData({
        name: fetchedPlayer.name,
        age: fetchedPlayer.age,
        relationshipStatus: fetchedPlayer.relationshipStatus,
        bio: fetchedPlayer.bio,
        profilePicture: fetchedPlayer.profilePicture,
      });
    }

    return () => {
      socket.off('profile-saved-successfully');
    };
  }, []);

  return (
    <CircleInterface>
      {editable && (
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
          >
            <Box
              backgroundColor="brand.white"
              borderRadius="8px"
              p={3}
              border="1px"
              borderColor="black"
              onClick={openImageUpload}
            >
              <Text
                color="black"
                fontWeight="400"
                fontSize="1.5em"
                cursor="pointer"
              >
                {profileData.profilePicture ? 'Change Image' : 'Choose Image'}
              </Text>
            </Box>
          </Box>
          <Stack
            direction="column"
            width={{ xs: '100%', sm: '100%', md: '50%' }}
          >
            <Input
              size="lg"
              placeholder="Name"
              value={profileData.name}
              onChange={handleNameChange}
              isInvalid={isErrorField('name')}
            />
            <Input
              size="lg"
              placeholder="Age"
              value={profileData.age}
              onChange={handleAgeChange}
              isInvalid={isErrorField('age')}
            />
            <Input
              size="lg"
              placeholder="Relationship Status"
              value={profileData.relationshipStatus}
              onChange={handleRelationshipChange}
              isInvalid={isErrorField('relationship')}
            />
            <Textarea
              placeholder="Bio"
              size="lg"
              resize="none"
              minHeight="52%"
              value={profileData.bio}
              onChange={handleBioChange}
              isInvalid={isErrorField('bio')}
            ></Textarea>
            <Button
              colorScheme="purpleButton"
              fontSize={{ xs: '2em', md: '1.5em' }}
              height={{ xs: '4em', md: '2.5em' }}
              fontWeight="400"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? <Spinner /> : 'Submit Profile'}
            </Button>
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
          </Stack>
          <input
            onChange={handleImageUpload}
            type="file"
            style={{ display: 'none' }}
            id="profile-upload"
          />
        </Stack>
      )}
      {!editable && (
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
          <Stack
            direction="column"
            width={{ xs: '100%', sm: '100%', md: '50%' }}
          >
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
      )}
    </CircleInterface>
  );
};

export default Profile;
