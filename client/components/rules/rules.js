import React from 'react';
import {
  Box,
  Container,
  Stack,
  UnorderedList,
  ListItem,
  Heading,
  Text,
} from '@chakra-ui/react';

const Rules = () => (
  <Box bg="brand.white" p={5} mt={5} mb={5}>
    <Container maxW="container.xl">
      <Stack direction={['column', null, 'column', null, 'row']} pt={5} pb={5}>
        <Box position="relative" minHeight="400px" width="50%">
          <Box
            position="absolute"
            height="400px"
            width="400px"
            p={3}
            background="brand.main"
          >
            <Box
              position="absolute"
              height="375px"
              width="375px"
              background="brand.white"
              backgroundImage="url(/assets/rules.png)"
              backgroundPosition="center"
              backgroundSize="cover"
              backgroundRepeat="no-repeat"
            />
          </Box>
        </Box>
        <Box display="flex" flexDirection="column" justifyContent="center">
          <Heading>Rules</Heading>
          <Text fontWeight="600">The rules of the circle are simple:</Text>
          <UnorderedList>
            <ListItem>
              Players can participate in group chats where they can compete to
              win the favor of the other competitors.
            </ListItem>
            <ListItem>
              Be careful! Some players may not be who they claim to be.
              Catfishing is a thing you know!
            </ListItem>
            <ListItem>
              If you are rated as the least popular person in the group, you
              will be <b>blocked</b> from the circle.
            </ListItem>
          </UnorderedList>
        </Box>
      </Stack>
    </Container>
  </Box>
);

export default Rules;
