import React from 'react';
import { Icon } from '@chakra-ui/react';

const SendIcon = ({ color, fill, ...props }) => (
  <Icon viewBox="0 0 61 61" fill={fill || 'none'} {...props}>
    <path
      d="M55.9168 5.08337L27.9585 33.0417"
      stroke={color || 'white'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M55.9168 5.08337L38.1252 55.9167L27.9585 33.0417L5.0835 22.875L55.9168 5.08337Z"
      stroke={color || 'white'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
);

export default SendIcon;
