import React from 'react';
import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
  Flex,
} from '@chakra-ui/react';

const Stats = () => (
  <Box
    sx={{ background: 'linear-gradient(90deg, #667EEA 0%, #4835C0 100%);' }}
    p={20}
    mt={5}
    mb={5}
  >
    <Container maxW="container.lg">
      <Grid
        gridTemplateColumns={['repeat(1,1fr)', null, 'repeat(2, 1fr)']}
        gap="2em"
      >
        <GridItem background="brand.white" padding={10}>
          <Flex
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
          >
            <Heading textAlign="center" fontWeight="300" fontSize="2em">
              Total Games Played
            </Heading>
            <Text fontSize="2em" color="brand.offtext">
              100
            </Text>
          </Flex>
        </GridItem>
        <GridItem background="brand.white" padding={10}>
          <Flex
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
          >
            <Heading textAlign="center" fontWeight="300" fontSize="2em">
              Total Games Played
            </Heading>
            <Text fontSize="2em" color="brand.offtext">
              100
            </Text>
          </Flex>
        </GridItem>
      </Grid>
    </Container>
  </Box>
);

export default Stats;
