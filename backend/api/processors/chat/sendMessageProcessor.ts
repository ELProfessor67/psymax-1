import { Redis } from 'ioredis';
import * as chatEvent from '@shared/constants/chatEventsConstant';

interface IData {
    room_id: string,
    text: string,
    name: string,
    socketId: string
}

const createSendMessageProcessor = (redispub: Redis, data: IData) => {
    redispub.publish(chatEvent.redisChannel, JSON.stringify(data));
}

export default createSendMessageProcessor