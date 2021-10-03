import express from 'express';
import getTotalGames from './totalGames';
import getTotalPlayers from './totalPlayers';
import uploadProfile from './uploadProfile';
import listPlayers from './listPlayers';
import getHost from './getHost';
import getMessages from './getMessages';
import getPrivateMessages from './getPrivateMessages';
import getChatParticipants from './getChatParticipants';
import getPrivateChatList from './getPrivateChatList';
import getUserPrivateChatList from './getUserPrivateChatList';
import getNewsfeed from './getNewsfeed';
import getPlayerInformation from './getPlayerInformation';
import getRatings from './getRatings';

const routes = express.Router();

routes.get('/total-games', getTotalGames);
routes.get('/total-players', getTotalPlayers);
routes.post('/upload-profile', uploadProfile);
routes.post('/list-players', listPlayers);
routes.post('/get-host', getHost);
routes.post('/get-messages', getMessages);
routes.post('/get-private-messages', getPrivateMessages);
routes.post('/get-chat-participants', getChatParticipants);
routes.post('/get-private-chat-list', getPrivateChatList);
routes.post('/get-user-private-chats', getUserPrivateChatList);
routes.post('/get-newsfeed', getNewsfeed);
routes.post('/player-information', getPlayerInformation);
routes.post('/get-ratings', getRatings);

export default routes;
