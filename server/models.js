const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  gameid: {
    type: String,
    required: true,
  },
  socketid: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  age: {
    type: String,
  },
  relationshipStatus: {
    type: String,
  },
  bio: {
    type: String,
  },
  profilePicture: {
    type: String,
  },
  host: {
    type: Boolean,
    default: false,
  },
  blocked: {
    type: Boolean,
    default: false,
  },
  disconnected: {
    type: Boolean,
    defaul: false,
  },
});

const User = mongoose.model('User', UserSchema);

const MessageSchema = new mongoose.Schema({
  gameid: {
    type: String,
    required: true,
  },
  socketid: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const Message = mongoose.model('Message', MessageSchema);

const PrivateChatSchema = new mongoose.Schema({
  gameid: {
    type: String,
    required: true,
  },
  chatid: {
    type: String,
    required: true,
  },
  chatname: {
    type: String,
  },
  participants: {
    type: Array,
    required: true,
  },
  participantNames: {
    type: Array,
    required: true,
  },
  closed: {
    type: Boolean,
    default: false,
  },
});

const PrivateChat = mongoose.model('PrivateChat', PrivateChatSchema);

const PrivateMessageSchema = new mongoose.Schema({
  chatid: {
    type: String,
    required: true,
  },
  socketid: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const PrivateMessage = mongoose.model('PrivateMessage', PrivateMessageSchema);

const NewsFeedSchema = new mongoose.Schema({
  gameid: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const NewsFeed = mongoose.model('NewsFeed', NewsFeedSchema);

const RatingsSchema = new mongoose.Schema({
  gameid: {
    type: String,
    required: true,
  },
  socketid: {
    type: String,
    required: true,
  },
  rating: {
    type: Array,
    required: true,
  },
  ratingCount: {
    type: Number,
    required: true,
  },
});

const Ratings = mongoose.model('Ratings', RatingsSchema);

const BlockSchema = new mongoose.Schema({
  influencerChatId: {
    type: String,
    required: true,
  },
  blocks: {
    type: Array,
    required: true,
  },
});

const Blocks = mongoose.model('Blocks', BlockSchema);

module.exports = {
  userModel: User,
  messageModel: Message,
  privateChatModel: PrivateChat,
  privateMessageModel: PrivateMessage,
  newsFeedModel: NewsFeed,
  ratingsModel: Ratings,
  blockModel: Blocks,
};
