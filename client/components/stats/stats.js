import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
  Flex,
} from '@chakra-ui/react';
import axios from 'axios';
import CountUp from 'react-countup';
import VisibilitySensor from 'react-visibility-sensor';

const serverString = `${process.env.NEXT_PUBLIC_CIRCLE_SERVER}${
  process.env.NEXT_PUBLIC_CIRCLE_PORT
    ? `:${process.env.NEXT_PUBLIC_CIRCLE_PORT}`
    : ''
}`;

const Stats = () => {
  const [totalTrackedPlayers, setTotalTrackedPlayers] = useState(0);
  const [totalTrackedGames, setTotalTrackedGames] = useState(0);
  const [viewPortEntered, setViewPortEntered] = useState(false);

  useEffect(async () => {
    const {
      data: { totalGames },
    } = await axios.get(`${serverString}/total-games`);
    const {
      data: { totalPlayers },
    } = await axios.get(`${serverString}/total-players`);
    setTotalTrackedPlayers(totalPlayers);
    setTotalTrackedGames(totalGames);
  }, []);

  return (
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
                <CountUp
                  start={viewPortEntered ? null : 0}
                  duration={1}
                  end={totalTrackedGames}
                >
                  {({ countUpRef }) => (
                    <VisibilitySensor
                      active={!viewPortEntered}
                      onChange={(isVisible) => {
                        if (isVisible) setViewPortEntered(true);
                      }}
                      delayedCall
                    >
                      <h4 ref={countUpRef} />
                    </VisibilitySensor>
                  )}
                </CountUp>
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
                Total Players
              </Heading>
              <Text fontSize="2em" color="brand.offtext">
                <CountUp
                  start={viewPortEntered ? null : 0}
                  duration={1}
                  end={totalTrackedPlayers}
                >
                  {({ countUpRef }) => (
                    <VisibilitySensor
                      active={!viewPortEntered}
                      onChange={(isVisible) => {
                        if (isVisible) setViewPortEntered(true);
                      }}
                      delayedCall
                    >
                      <h4 ref={countUpRef} />
                    </VisibilitySensor>
                  )}
                </CountUp>
              </Text>
            </Flex>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};

export default Stats;
