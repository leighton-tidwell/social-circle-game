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
    blueButton: {
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
    purpleButton: {
      50: '#69399A',
      100: '#69399A',
      200: '#69399A',
      300: '#69399A',
      400: '#69399A',
      500: '#69399A',
      600: '#69399A',
      700: '#69399A',
      800: '#69399A',
      900: '#69399A',
    },
  },
});

const MyApp = ({ Component, pageProps }) => (
  <ChakraProvider theme={theme}>
    <div suppressHydrationWarning>
      <Component {...pageProps} />
    </div>
  </ChakraProvider>
);

export default MyApp;
