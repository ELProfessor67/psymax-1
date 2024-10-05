import { MESSAGE, REDIS_CHANNEL } from "@shared/constants/chatEventsConstant.js";
import {Redis} from 'ioredis'
import {Server,DefaultEventsMap} from 'socket.io'

const createRecieveMessageProcessor = (redissub:Redis,redispub:Redis,io:Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
    redissub.on('message', (channel:string, message:string) => {
        if (channel === REDIS_CHANNEL) {
            const { room_id, text,name,socketId } = JSON.parse(message);
            console.log(room_id,text,name,socketId)
            io.to(room_id).emit(MESSAGE, {message:text,name,socketId});
        }
    });

    // Optional error handling
    redissub.on('error', (err:any) => {
        console.error('Redis subscriber error:', err);
    });

    redispub.on('error', (err:any) => {
        console.error('Redis publisher error:', err);
    });
}

export default createRecieveMessageProcessor