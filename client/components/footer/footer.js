import React from 'react';
import {
  Box,
  Container,
  Text,
  Center,
  Stack,
  Link as ChakraLink,
} from '@chakra-ui/react';
import Link from 'next/link';

const Footer = () => (
  <Box background="brand.white" minHeight="100px">
    <Container maxW="container.sm">
      <Center flexDirection="column">
        <Stack
          direction="row"
          spacing="5em"
          color="brand.offtext"
          fontWeight="600"
          mb={2}
        >
          <Link href="/">
            <ChakraLink>HOME</ChakraLink>
          </Link>
          <Link href="/">
            <ChakraLink>GAME</ChakraLink>
          </Link>
          <Link href="/">
            <ChakraLink>TERMS</ChakraLink>
          </Link>
        </Stack>
        <Text fontWeight="300" color="brand.offtext">
          Created by @leighton-tidwell
        </Text>
      </Center>
    </Container>
  </Box>
);

export default Footer;
