import * as mediasoup from 'mediasoup';
import {Producer} from '../../processors/webrtc/createProducersProcessor'
import { peers, producersContainer } from 'api/constants/variableConstant';
import UserModel from 'api/model/userModel';

export const addProducer = (producer: mediasoup.types.Producer, room_id: string, socketId: string) => {
    const newProducer: Producer = new Producer(socketId, producer, room_id);
    producersContainer.addProducer(newProducer);

    const peerRef: UserModel = peers.get(socketId);
    peerRef.producers = [...peerRef.producers, producer.id]
    peers.set(socketId, peerRef);
}