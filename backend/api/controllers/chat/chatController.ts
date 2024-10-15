import { Socket } from "socket.io";
import publishMessageProcessor from "api/processors/chat/publishMessageProcessor"
import {Redis} from "ioredis"
import { IReciveMessageControllerArguments } from '@shared/interfaces/chatInterfaces'

export const joinChatRoom = async ({room_id,name}:{room_id:string,name:string},callback:(id:string) => void,socket:Socket) => {
    try {
        socket.join(room_id)
        callback(socket.id);
    } catch (error) {
        console.log('Error white joining chat room',(error as Error).message);
    }
}

export const messageRecieve = async ({room_id, text,name}:IReciveMessageControllerArguments,redisPub:Redis,socket:Socket) => {
    try {
        publishMessageProcessor(redisPub,{ room_id, text,name,socketId:socket.id });
    } catch (error) {
        console.log('Error while recieving message',(error as Error).message)
    }
}