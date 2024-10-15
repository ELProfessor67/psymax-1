import http from 'http';
import createSockerServer from 'api/processors/socket/createSocketProcessor';
import { CONNECT_TRANSPORT, CONSUME, CONSUME_RESUME, CREATE_WEBRTC_TRANSPORT, DISCONNECT, GET_PRODUCERS, JOIN_ROOM, MUTE_UNMUTE, PRODUCE_TRANSPORT, TRANSPORT_RECV_CONNECT } from '@shared/constants/mediasoupEventConstant';
import { connectTransport, createWebRtcTransport, getProducer, produceTransport, transportConnect, userDisconnect } from 'api/controllers/webRTC';
import {consumeMedia,consumerMediaResume, manageMedia} from 'api/controllers/media';
import { joinRoom } from 'api/controllers/user';
import { Server } from 'socket.io';


class MediasoupRoute {
    public _io:Server;
    public httpServer: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;

    constructor(httpServer:http.Server){
        this.httpServer = httpServer;
        const mediaSocketServer = new createSockerServer();
        mediaSocketServer.io.attach(httpServer);
        this._io = mediaSocketServer.io;
        this.initMediaSoupSocketRoute();
    }

    initMediaSoupSocketRoute(){
        const io = this._io;
        io.on('connection',(socket) => {
            console.log('user connect ',socket.id);
            socket.on(JOIN_ROOM,(argument,callback) => joinRoom(argument,callback,socket));
            socket.on(DISCONNECT,() => userDisconnect(socket,io));
            socket.on(CREATE_WEBRTC_TRANSPORT,(argument,callback) => createWebRtcTransport(argument,callback,socket));
            socket.on(CONNECT_TRANSPORT,(argument) => connectTransport(argument,socket));
            socket.on(PRODUCE_TRANSPORT,(argument,callback) => produceTransport(argument,callback,socket));
            socket.on(GET_PRODUCERS,(callback) => getProducer(callback,socket));
            socket.on(TRANSPORT_RECV_CONNECT,(argument) => transportConnect(argument));
            socket.on(CONSUME,(argumet,callback) => consumeMedia(argumet,callback,socket));
            socket.on(CONSUME_RESUME,(argument) => consumerMediaResume(argument));
            socket.on(MUTE_UNMUTE,(argument) => manageMedia(argument,socket));
        })
    }
}

export default MediasoupRoute;