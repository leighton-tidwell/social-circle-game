import React, { useState, useContext } from 'react';
import {
  Box,
  Button,
  Stack,
  Input,
  Textarea,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { CircleContext } from '../../context/circle';
import axios from 'axios';

const SetupProfile = ({ onProfileSave }) => {
  const [profileData, setProfileData] = useState({
    name: '',
    age: '',
    relationshipStatus: '',
    bio: '',
    profilePicture: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { socket, serverString } = useContext(CircleContext);

  const openImageUpload = () => {
    document.querySelector('#profile-upload').click();
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.addEventListener('load', () =>
        resolve(reader.result?.slice(reader.result?.indexOf(',') + 1))
      );
      reader.addEventListener('error', () =>
        reject(new Error('File could not be parsed'))
      );
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
        setProfileData((previousData) => ({
          ...previousData,
          profilePicture: `data:${fileData.mimeType};base64,${fileData.base64}`,
        }));
        setError('');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSubmit = async () => {
    if (!profileData.name) return setError('Name is missing!');
    if (!profileData.age) return setError('Age is missing!');
    if (!profileData.relationshipStatus)
      return setError('Relationship status is missing!');
    if (!profileData.bio) return setError('Bio is missing!');
    if (!profileData.profilePicture)
      return setError('You forgot a profile picture!');

    setLoading(true);
    const user = {
      socketid: socket.id,
      ...profileData,
    };

    try {
      await axios.post(`${serverString}/upload-profile`, {
        user,
      });
      setLoading(false);
      onProfileSave(true);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleNameChange = (event) => {
    setProfileData((previousData) => ({
      ...previousData,
      name: event.target.value,
    }));
    setError('');
  };

  const handleAgeChange = (event) => {
    setProfileData((previousData) => ({
      ...previousData,
      age: event.target.value,
    }));
    setError('');
  };

  const handleRelationshipChange = (event) => {
    setProfileData((previousData) => ({
      ...previousData,
      relationshipStatus: event.target.value,
    }));
    setError('');
  };

  const handleBioChange = (event) => {
    setProfileData((previousData) => ({
      ...previousData,
      bio: event.target.value,
    }));
    setError('');
  };

  const clearError = () => {
    setError('');
  };

  const isErrorField = (field) => {
    if (!error.toLowerCase().includes(field)) return false;
    return true;
  };

  return (
    <Stack>
      <Text>Please set up your profile to find a match!</Text>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="200px"
        backgroundPosition="center center"
        backgroundSize="cover"
        backgroundColor="rgba(99,99,99,.17)"
        borderRadius="8px"
        backgroundImage={
          profileData.profilePicture ? `url(${profileData.profilePicture})` : ''
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
          cursor="pointer"
          onClick={openImageUpload}
        >
          Choose Image
        </Box>
      </Box>
      <Input
        size="md"
        placeholder="Name"
        value={profileData.name}
        onChange={handleNameChange}
        isInvalid={isErrorField('name')}
      />
      <Input
        size="md"
        placeholder="Age"
        value={profileData.age}
        onChange={handleAgeChange}
        isInvalid={isErrorField('age')}
      />
      <Input
        size="md"
        placeholder="Relationship Status"
        value={profileData.relationshipStatus}
        onChange={handleRelationshipChange}
        isInvalid={isErrorField('relationship')}
      />
      <Textarea
        placeholder="Bio"
        size="md"
        resize="none"
        minHeight="200px"
        value={profileData.bio}
        onChange={handleBioChange}
        isInvalid={isErrorField('bio')}
      />
      <Button
        colorScheme="purpleButton"
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
      <input
        onChange={handleImageUpload}
        type="file"
        style={{ display: 'none' }}
        id="profile-upload"
      />
    </Stack>
  );
};

export default SetupProfile;
