import { peers, transportsContainer } from "api/constants/variableConstant";
import { Transport } from "api/processors/webrtc/createTransportProcessor";
import * as mediasoup from 'mediasoup'
import UserModel from "api/model/userModel";

export const addTransport = (transport: mediasoup.types.WebRtcTransport, room_id: string, consumer: Boolean, socketId: string) => {
    const transportRef: Transport = new Transport(socketId, transport, room_id, consumer);
    transportsContainer.addTransport(transportRef);

    const peerRef: UserModel = peers.get(socketId);
    peerRef.transports = [...peerRef.transports, transport.id]
    peers.set(socketId, peerRef);
}