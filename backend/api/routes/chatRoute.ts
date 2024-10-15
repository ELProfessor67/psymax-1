import http from 'http';
import express from 'express';
import createSockerServer from 'api/processors/socket/createSocketProcessor';
import {Redis} from 'ioredis';
import { JOIN_ROOM, MESSAGE, REDIS_CHANNEL } from '@shared/constants/chatEventsConstant';
import { createRecieveMessageService } from 'api/services/chat/chatService';
import { joinChatRoom } from 'api/controllers/chat/joinChatRoomController';
import { messageRecieve } from 'api/controllers/chat/messageRecieveController';
import {config} from 'dotenv';
import { Server } from 'socket.io';

config()

class ChatRoute {
    public redisPub:Redis
    public redisSub:Redis
    public _io:Server;
    public httpServer:http.Server;

    constructor(httpServer:http.Server){

        const redisUrl = process.env.REDIS_URL as string; 
        if (!redisUrl) {
            throw new Error('REDIS_URL environment variable is not set');
        }

        this.redisPub = new Redis(redisUrl);
        this.redisSub = new Redis(redisUrl);
        this.redisSub.subscribe(REDIS_CHANNEL);

        this.httpServer = httpServer;

        const chatSocketServer = new createSockerServer();
        chatSocketServer.io.attach(httpServer);
        this._io = chatSocketServer.io;

        createRecieveMessageService(this.redisSub,this.redisPub,this._io);

        this.initRoutes()
    }

    initRoutes(){
        const io = this._io;
        io.on('connection',(socket) => {
            console.log('user connect on chat server ',socket.id);
            socket.on(JOIN_ROOM,(argument,callback) => joinChatRoom(argument,callback,socket));
            socket.on(MESSAGE,(argument) => messageRecieve(argument,this.redisPub,socket));
        })

    }
}

export default ChatRoute;