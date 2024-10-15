import { transportsContainer } from 'api/constants/variableConstant';
import * as mediasoup from 'mediasoup';
import { Socket } from 'socket.io';
import { ITransportFunctionArguments, IPramas } from "@shared/interfaces/webRTCInterfaces";
import { peers, rooms } from "api/constants/variableConstant";
import Room from '../../processors/room/manageRoomProcessor'
import { addTransport } from "api/services/webRTC/webRTCService";
import { producersContainer } from "api/constants/variableConstant";
import { IProducerData } from "api/processors/media/createProducersMediaProcessor";
import { NEW_PRODUCER } from "@shared/constants/mediasoupEventConstant"
import { IProceTransportAguments } from "@shared/interfaces/webRTCInterfaces"
import { addProducer } from "api/services/media/mediaService"
import { consumerContainer } from "api/constants/variableConstant";
import { Server } from "socket.io";
import RoomService from "../../processors/room/manageRoomProcessor";
import { PARTICIPANTS_DISCONNECT } from "@shared/constants/mediasoupEventConstant";


export const connectTransport = async ({ dtlsParameters }:{dtlsParameters: mediasoup.types.DtlsParameters},socket:Socket) => {
    try {
        await transportsContainer.getTranport(socket.id)?.connect({ dtlsParameters });
    } catch (error) {
        console.log('Getting error while connecting transport: ',(error as Error).message)
    }
}

export const createWebRtcTransport = async ({ consumer }:ITransportFunctionArguments, callback:(argument:{params:IPramas}) => void,socket:Socket) => {
    try {
        console.log('connect trasport')
        const room_id = peers.get(socket.id).room_id;
        const roomRef: Room = rooms.get(room_id);

        roomRef.createWebRtcTransport().then((transport) => {
            
            callback({
                params: {
                    id: transport.id,
                    iceParameters: transport.iceParameters,
                    iceCandidates: transport.iceCandidates,
                    dtlsParameters: transport.dtlsParameters,
                }
            });

            addTransport(transport, room_id, consumer, socket.id);
            

        }).catch((error: Error) => {
            callback({
                params: {
                    error: error.message
                }
            })
            console.log('error white creating webrtc transport', error.message);
        })
    } catch (error) {
        console.log('Error While creating Webrtc transport: ', (error as Error).message);
    }
}

export const getProducer = async (callback: (producerIds: IProducerData[]) => void,socket:Socket) => {
    try {
        const room_id = peers.get(socket.id).room_id;
        const producerIds = producersContainer.getAllProducer(room_id, socket.id);
        callback(producerIds);
    } catch (error) {

    }
}

export const produceTransport = async ({ kind, rtpParameters, appData }:IProceTransportAguments, callback: ({id,producersExist}:{id: string,producersExist:boolean}) => void,socket:Socket) => {
    try {
        const producer = await transportsContainer.getTranport(socket.id)?.produce({
            kind,
            rtpParameters,
        })

        if(!producer){
            return
        }



        // add producer to the producers array
        const room_id = peers.get(socket.id).room_id;

        addProducer(producer, room_id, socket.id)



        console.log('Producer ID: ', producer.id, producer.kind)
        socket.to(room_id).emit(NEW_PRODUCER,{producerId: producer.id,socketId: socket.id})

        producer.on('transportclose', () => {
            console.log('transport for this producer closed ')
            producer.close()
        })

        // Send back to the client the Producer's id

        callback({
            id: producer.id as string,
            producersExist: producersContainer.getAllProducer(room_id, socket.id).length > 0 ? true : false
        })
    } catch (error) {
        console.log('Getting Error While Produce Transport : ',(error as Error).message)
    }
}

export const transportConnect = async ({ dtlsParameters, serverConsumerTransportId }:{dtlsParameters:mediasoup.types.DtlsParameters,serverConsumerTransportId:string}) => {
    try {
        console.log(`DTLS PARAMS: ${dtlsParameters}`)
        const consumerTransport = transportsContainer.getTransportById(serverConsumerTransportId);
        try {
            await consumerTransport?.connect({ dtlsParameters });
        } catch (error) {
            console.log('error:', (error as Error).message)
        }
    } catch (error) {
        console.log('Error white connectiong transport: ', (error as Error).message)
    }
}

export const userDisconnect = async (socket: Socket,connection:Server) => {
    try {
        const room_id = peers.get(socket.id)?.room_id;
        peers.delete(socket.id);

        transportsContainer.remove(socket.id);
        producersContainer.remove(socket.id);
        consumerContainer.remove(socket.id)

        const roomRef: RoomService = rooms.get(room_id);
        if (roomRef?.participants) {
            roomRef.participants = roomRef.participants.filter(socketId => socketId != socket.id);
        }
        rooms.set(room_id, roomRef);
        connection.to(room_id).emit(PARTICIPANTS_DISCONNECT, { socketId: socket.id });
    } catch (error) {
        console.log('Error while user disconnet: ',(error as Error).message)
    }
}