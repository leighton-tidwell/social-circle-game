import findMatch from './findMatch';
import toggleCircleChat from './toggleCircleChat';
import sendCircleChat from './sendCircleChat';
import startPrivateChat from './startPrivateChat';
import sendPrivateChat from './sendPrivateChat';
import newNewsfeed from './newNewsfeed';
import loadHome from './loadHome';
import toggleRatings from './toggleRatings';
import submitRatings from './submitRatings';
import finishRatings from './finishRatings';
import sendInfluencerMessage from './sendInfluencerMessage';
import selectBlock from './selectBlock';
import blockPlayer from './blockPlayer';
import stopFindMatch from './stopFindMatch';
import joinMatch from './joinMatch';
import playerLeftHostedMatch from './playerLeftHostedMatch';
import hostMatch from './hostMatch';
import startHostedMatch from './startHostedMatch';
import stopHostedMatch from './stopHostedMatch';
import disconnect from './disconnect';

const registerEventsHandler = (io, socket) => {
  // Force user into the idle room
  socket.join('IDLE_ROOM');

  socket.on('find-match', findMatch(io, socket));
  socket.on('stop-find-match', stopFindMatch(io, socket));
  socket.on('join-match', joinMatch(io, socket));
  socket.on('player-left-hosted-match', playerLeftHostedMatch(io, socket));
  socket.on('host-match', hostMatch(io, socket));
  socket.on('start-hosted-match', startHostedMatch(io, socket));
  socket.on('stop-hosted-match', stopHostedMatch(io, socket));

  socket.on('toggle-circle-chat', toggleCircleChat(io, socket));
  socket.on('send-circle-chat', sendCircleChat(io, socket));

  socket.on('start-private-chat', startPrivateChat(io, socket));
  socket.on('send-private-chat', sendPrivateChat(io, socket));

  socket.on('new-newsfeed', newNewsfeed(io, socket));

  socket.on('load-home', loadHome(io, socket));

  socket.on('toggle-ratings', toggleRatings(io, socket));
  socket.on('submit-ratings', submitRatings(io, socket));
  socket.on('finish-ratings', finishRatings(io, socket));

  socket.on('send-influencer-message', sendInfluencerMessage(io, socket));
  socket.on('select-block', selectBlock(io, socket));
  socket.on('block-player', blockPlayer(io, socket));

  socket.on('disconnect', disconnect(io, socket));
};

export default registerEventsHandler;
