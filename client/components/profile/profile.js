import React from 'react';
import { Box, Stack, Text, Input, Textarea, Button } from '@chakra-ui/react';
import { CircleInterface } from '../../components/';

const Profile = () => {
  return (
    <CircleInterface>
      <Stack direction="row" height="100%" width="100%" spacing="2em">
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          backgroundColor="rgba(99,99,99,.17)"
          height="100%"
          width="50%"
        >
          <Box
            backgroundColor="brand.white"
            borderRadius="8px"
            p={3}
            border="1px"
            borderColor="black"
          >
            <Text
              color="black"
              fontWeight="400"
              fontSize="1.5em"
              cursor="pointer"
            >
              Choose Image
            </Text>
          </Box>
        </Box>
        <Stack direction="column" width="50%">
          <Input size="lg" placeholder="Name" />
          <Input size="lg" placeholder="Age" />
          <Input size="lg" Placeholder="Relationship Status" />
          <Textarea
            placeholder="Bio"
            size="lg"
            resize="none"
            minHeight="52%"
          ></Textarea>
          <Button
            colorScheme="purpleButton"
            fontSize="1.5em"
            height="2.5em"
            fontWeight="400"
          >
            Submit Profile
          </Button>
        </Stack>
      </Stack>
    </CircleInterface>
  );
};

export default Profile;
