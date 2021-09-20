import React from 'react';
import { Icon } from '@chakra-ui/react';

const MessageIcon = ({ color, fill, ...props }) => {
  return (
    <Icon viewBox="0 0 51 50" fill={fill || 'none'} {...props}>
      <path
        d="M39.7366 10.2708C36.3183 6.83021 31.8067 4.69002 26.9796 4.21925C22.1525 3.74848 17.3123 4.97662 13.2937 7.69194C9.275 10.4073 6.32961 14.4396 4.96529 19.0938C3.60097 23.7479 3.90323 28.7323 5.81995 33.1875C6.01972 33.6016 6.08527 34.0677 6.00745 34.5208L4.17412 43.3333C4.10348 43.6712 4.11791 44.0213 4.21609 44.3522C4.31427 44.6832 4.49314 44.9845 4.73662 45.2292C4.93621 45.4273 5.17385 45.583 5.43523 45.6868C5.6966 45.7907 5.9763 45.8405 6.25745 45.8333H6.67412L15.5908 44.0417C16.044 43.9872 16.5035 44.0518 16.9241 44.2292C21.3793 46.1459 26.3637 46.4481 31.0178 45.0838C35.672 43.7195 39.7044 40.7741 42.4197 36.7554C45.135 32.7368 46.3631 27.8967 45.8924 23.0695C45.4216 18.2424 43.2814 13.7308 39.8408 10.3125L39.7366 10.2708ZM16.6741 27.0833C16.2621 27.0833 15.8593 26.9611 15.5167 26.7322C15.1741 26.5033 14.907 26.1779 14.7494 25.7973C14.5917 25.4166 14.5504 24.9977 14.6308 24.5936C14.7112 24.1894 14.9096 23.8182 15.201 23.5269C15.4923 23.2355 15.8636 23.0371 16.2677 22.9567C16.6718 22.8763 17.0907 22.9176 17.4714 23.0753C17.8521 23.2329 18.1774 23.5 18.4063 23.8426C18.6353 24.1852 18.7575 24.588 18.7575 25C18.7575 25.5525 18.538 26.0824 18.1473 26.4731C17.7566 26.8638 17.2267 27.0833 16.6741 27.0833ZM25.0075 27.0833C24.5954 27.0833 24.1926 26.9611 23.85 26.7322C23.5074 26.5033 23.2404 26.1779 23.0827 25.7973C22.925 25.4166 22.8838 24.9977 22.9641 24.5936C23.0445 24.1894 23.243 23.8182 23.5343 23.5269C23.8257 23.2355 24.1969 23.0371 24.601 22.9567C25.0051 22.8763 25.424 22.9176 25.8047 23.0753C26.1854 23.2329 26.5108 23.5 26.7397 23.8426C26.9686 24.1852 27.0908 24.588 27.0908 25C27.0908 25.5525 26.8713 26.0824 26.4806 26.4731C26.0899 26.8638 25.56 27.0833 25.0075 27.0833ZM33.3408 27.0833C32.9287 27.0833 32.5259 26.9611 32.1833 26.7322C31.8407 26.5033 31.5737 26.1779 31.416 25.7973C31.2584 25.4166 31.2171 24.9977 31.2975 24.5936C31.3779 24.1894 31.5763 23.8182 31.8676 23.5269C32.159 23.2355 32.5302 23.0371 32.9343 22.9567C33.3385 22.8763 33.7574 22.9176 34.138 23.0753C34.5187 23.2329 34.8441 23.5 35.073 23.8426C35.3019 24.1852 35.4241 24.588 35.4241 25C35.4241 25.5525 35.2046 26.0824 34.8139 26.4731C34.4232 26.8638 33.8933 27.0833 33.3408 27.0833Z"
        fill={color || 'white'}
      />
    </Icon>
  );
};

export default MessageIcon;
