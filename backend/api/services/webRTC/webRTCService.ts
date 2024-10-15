import { consumerContainer, peers,transportsContainer } from "api/constants/variableConstant";
import UserModel from "api/model/userModel";
import * as mediasoup from 'mediasoup';
import {Consumer} from '../../processors/webRTC/createConsumerProcessor'
import { Transport } from "api/processors/webRTC/createTransportProcessor";


export const addConsumer = (consumer: mediasoup.types.Consumer, room_id: string, socketId: string) => {
    const newConsumer: Consumer = new Consumer(socketId, consumer, room_id);
        consumerContainer.addConsumer(newConsumer);

        const peerRef: UserModel = peers.get(socketId);
        peerRef.consumers = [...peerRef.consumers, consumer.id]
        peers.set(socketId, peerRef);
}


export const addTransport = (transport: mediasoup.types.WebRtcTransport, room_id: string, consumer: Boolean, socketId: string) => {
    const transportRef: Transport = new Transport(socketId, transport, room_id, consumer);
    transportsContainer.addTransport(transportRef);

    const peerRef: UserModel = peers.get(socketId);
    peerRef.transports = [...peerRef.transports, transport.id]
    peers.set(socketId, peerRef);
}