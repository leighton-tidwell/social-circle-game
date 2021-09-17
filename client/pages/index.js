import React from 'react';

import { Navigation, Hero, Rules, Stats, Footer } from '../components/index';

const Home = () => (
  // Const [socket, setSocket] = useState(null);
  // const [message, setMessage] = useState('');

  // const sendMessage = (event) => {
  //   event.preventDefault();

  //   const newMessage = {
  //     id: '123',
  //     user: { name: 'bob' },
  //     value: message,
  //   };

  //   socket.emit('message', newMessage);

  //   setMessage('');
  // };

  // const handleNewMessage = (inputMessage) => {
  //   setMessages((previousState) => [...previousState, inputMessage]);
  // };

  // useEffect(() => {
  //   const newSocket = io(`http://${window.location.hostname}:3001`);
  //   setSocket(newSocket);

  //   newSocket.on('message', handleNewMessage);
  //   newSocket.emit('getMessages');
  //   return () => newSocket.close();
  // }, [setSocket]);

  <>
    <Navigation />
    <Hero />
    <Rules />
    <Stats />
    <Footer />
  </>
);
export default Home;
