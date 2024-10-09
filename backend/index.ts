import express from 'express'
import http from 'http'
import {config} from 'dotenv';
import ConnectSocketProcessor from './api/processors/socket/connectSocketProcessor.js';
import ChatListner from './api/processors/socket/chatSocketEventlistenProcessor.js';
import router from './api/routes/index.js';
import mediaServer from 'api/routes/medisoupRouter.js';

const chatApp = express();
const mediasoupApp = express();
mediasoupApp.use(router);
config()



//chats
const chatServer = http.createServer(chatApp);
const createChatSocketConnect = new ConnectSocketProcessor();
createChatSocketConnect.io.attach(chatServer);
const chatListner = new ChatListner(createChatSocketConnect.io);
chatListner.initChatListeners();



const MPORT = process.env.MEDIASOUP_PORT || 4000;
const CPORT = process.env.CHAT_PORT || 4001;






mediaServer.listen(MPORT, () => {
    console.log(`Mediasoup Server Running on port ${MPORT}`)
});

chatServer.listen(CPORT, () => {
    console.log(`Chat Server Running on port ${CPORT}`)
});