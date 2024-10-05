import { Redis } from 'ioredis';
import {REDIS_CHANNEL} from '@shared/constants/chatEventsConstant';

interface IData {
    room_id: string,
    text: string,
    name: string,
    socketId: string
}

const createSendMessageProcessor = (redispub: Redis, data: IData) => {
    redispub.publish(REDIS_CHANNEL, JSON.stringify(data));
}

export default createSendMessageProcessor