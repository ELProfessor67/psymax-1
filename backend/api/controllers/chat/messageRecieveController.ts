import publishMessageProcessor from "api/processors/chat/publishMessageProcessor"
import {Redis} from "ioredis"
import { Socket } from "socket.io"

interface IArguments 
{
    room_id:string,
    text:string,
    name: string
}
export const messageRecieve = async ({room_id, text,name}:IArguments,redisPub:Redis,socket:Socket) => {
    try {
        publishMessageProcessor(redisPub,{ room_id, text,name,socketId:socket.id });
    } catch (error) {
        console.log('Error while recieving message',(error as Error).message)
    }
}