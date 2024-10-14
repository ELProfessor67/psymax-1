import http from 'http';
import express from 'express';
import createSockerServer from 'api/processors/socket/createSocketProcessor';
import {Redis} from 'ioredis';
import { JOIN_ROOM, MESSAGE, REDIS_CHANNEL } from '@shared/constants/chatEventsConstant';
import { createRecieveMessageService } from 'api/services/chat/receiveMessageService';
import { joinChatRoom } from 'api/controllers/chat/joinChatRoomController';
import { messageRecieve } from 'api/controllers/chat/messageRecieveController';
import {config} from 'dotenv';

config()

const app = express();


//connect with redis
const redisUrl = process.env.REDIS_URL as string;
if (!redisUrl) {
    throw new Error('REDIS_URL environment variable is not set');
}
const redisPub:Redis = new Redis(redisUrl);
const redisSub:Redis = new Redis(redisUrl);

//subscribe redis channel
redisSub.subscribe(REDIS_CHANNEL);

const chatHttpServer = http.createServer(app);

//connect socket server with httpServer
const chatSocketServer = new createSockerServer();
chatSocketServer.io.attach(chatHttpServer);
const io = chatSocketServer.io;


//lister redis message
createRecieveMessageService(redisSub,redisPub,io);

io.on('connection',(socket) => {
    console.log('user connect on chat server ',socket.id);
    socket.on(JOIN_ROOM,(argument,callback) => joinChatRoom(argument,callback,socket));
    socket.on(MESSAGE,(argument) => messageRecieve(argument,redisPub,socket));

})

export default chatHttpServer;