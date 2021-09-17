/* eslint-disable react/prop-types */
import React from 'react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import '../styles/globals.css';

const theme = extendTheme({
  fonts: {
    heading: 'Poppins',
    body: 'Poppins',
  },
  colors: {
    brand: {
      main: '#667EEA',
      secondary: '#69399A',
      tertiary: '#667EEA',
      white: '#FFFFFF',
      offtext: '#636363',
    },
    purpleNavButton: {
      50: '#667EEA',
      100: '#667EEA',
      200: '#667EEA',
      300: '#667EEA',
      400: '#667EEA',
      500: '#667EEA',
      600: '#667EEA',
      700: '#667EEA',
      800: '#667EEA',
      900: '#667EEA',
    },
  },
});

const MyApp = ({ Component, pageProps }) => (
  <ChakraProvider theme={theme}>
    <Component {...pageProps} />
  </ChakraProvider>
);

export default MyApp;
