import React, { useEffect, useState } from 'react';
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
import axios from 'axios';

const serverString = `${process.env.NEXT_PUBLIC_CIRCLE_SERVER}${
  process.env.NEXT_PUBLIC_CIRCLE_PORT
    ? `:${process.env.NEXT_PUBLIC_CIRCLE_PORT}`
    : ''
}`;

const Profile = ({ socket, lobbyId, editable, match }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [relationshipStatus, setRelationshipStatus] = useState('');
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  let history = useHistory();
  const { id } = useParams();

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
      console.log(file);
      if (file) {
        const fileData = {
          mimeType: file.type,
          base64: await getBase64(file),
          file,
        };

        await hasMinPicDimension(fileData);
        setProfilePicture(
          `data:${fileData.mimeType};base64,${fileData.base64}`
        );
        setError('');
      }
    } catch (error_) {
      setError(error_.message);
    }
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
    setError('');
  };

  const handleAgeChange = (event) => {
    setAge(event.target.value);
    setError('');
  };

  const handleRelationshipChange = (event) => {
    setRelationshipStatus(event.target.value);
    setError('');
  };

  const handleBioChange = (event) => {
    setBio(event.target.value);
    setError('');
  };

  const clearError = () => {
    setError('');
  };

  const handleSubmit = () => {
    if (!name) return setError('Name is missing!');
    if (!age) return setError('Age is missing!');
    if (!relationshipStatus) return setError('Relationship status is missing!');
    if (!bio) return setError('Bio is missing!');
    if (!profilePicture) return setError('You forgot a profile picture!');
    console.log({
      name,
      age,
      relationshipStatus,
      bio,
      profilePicture,
    });

    const user = {
      gameid: lobbyId,
      socketid: socket.id,
      name,
      age,
      relationshipStatus,
      bio,
      profilePicture,
    };
    socket.emit('save-profile', user);
    setLoading(true);
  };

  const isErrorField = (field) => {
    if (error.toLowerCase().indexOf(field) === -1) return false;
    return true;
  };

  socket.on('profile-saved-successfully', () => {
    console.log('Got the saved profile message.');
    return history.push(`/game/profile/${socket.id}`);
  });

  useEffect(async () => {
    if (!id) return;
    const {
      data: { playerData },
    } = await axios.post(`${serverString}/player-information`, {
      socketid: id,
    });
    const fetchedPlayer = playerData[0];
    setName(fetchedPlayer.name);
    setAge(fetchedPlayer.age);
    setRelationshipStatus(fetchedPlayer.relationshipStatus);
    setBio(fetchedPlayer.bio);
    setProfilePicture(fetchedPlayer.profilePicture);
  }, []);

  return (
    <CircleInterface socket={socket}>
      {editable && (
        <Stack
          direction={{ xs: 'column', sm: 'column', md: 'row' }}
          height="100%"
          height={{ xs: '90%', sm: '90%', md: '100%' }}
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
            backgroundImage={profilePicture ? `url(${profilePicture})` : ''}
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
                {profilePicture ? 'Change Image' : 'Choose Image'}
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
              value={name}
              onChange={handleNameChange}
              isInvalid={isErrorField('name')}
            />
            <Input
              size="lg"
              placeholder="Age"
              value={age}
              onChange={handleAgeChange}
              isInvalid={isErrorField('age')}
            />
            <Input
              size="lg"
              placeholder="Relationship Status"
              value={relationshipStatus}
              onChange={handleRelationshipChange}
              isInvalid={isErrorField('relationship')}
            />
            <Textarea
              placeholder="Bio"
              size="lg"
              resize="none"
              minHeight="52%"
              value={bio}
              onChange={handleBioChange}
              isInvalid={isErrorField('bio')}
            ></Textarea>
            <Button
              colorScheme="purpleButton"
              fontSize={{ xs: '2em', sm: '1.5em' }}
              height={{ xs: '5em', md: '2.5em' }}
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
        <Stack direction="row" height="100%" width="100%" spacing="2em">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            backgroundColor="rgba(99,99,99,.17)"
            height="100%"
            width="50%"
            backgroundImage={profilePicture ? `url(${profilePicture})` : ''}
            backgroundPosition="center center"
            backgroundSize="cover"
          />
          <Stack direction="column" width="50%">
            <Text fontSize="2em" fontWeight="800">
              {name}
            </Text>
            <Text fontSize="1.5em">
              <b>Age:</b> {age}
            </Text>
            <Text fontSize="1.5em">
              <b>Relationship Status:</b> {relationshipStatus}
            </Text>
            <Text fontSize="1.5em">
              <b>Bio:</b> {bio}
            </Text>
          </Stack>
        </Stack>
      )}
    </CircleInterface>
  );
};

export default Profile;
