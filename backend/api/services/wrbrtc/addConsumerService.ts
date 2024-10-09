import { consumerContainer, peers } from "api/constants/variableConstant";
import UserModel from "api/model/userModel";
import * as mediasoup from 'mediasoup';
import {Consumer} from '../../processors/webrtc/createConsumerProcessor'


export const addConsumer = (consumer: mediasoup.types.Consumer, room_id: string, socketId: string) => {
    const newConsumer: Consumer = new Consumer(socketId, consumer, room_id);
        consumerContainer.addConsumer(newConsumer);

        const peerRef: UserModel = peers.get(socketId);
        peerRef.consumers = [...peerRef.consumers, consumer.id]
        peers.set(socketId, peerRef);
}