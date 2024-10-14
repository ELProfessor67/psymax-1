import { NEW_PRODUCER } from "@shared/constants/mediasoupEventConstant"
import { IProceTransportAguments } from "@shared/interfaces/webRTCInterfaces"
import { peers, producersContainer, transportsContainer } from "api/constants/variableConstant"
import UserModel from "api/model/userModel"
import { addProducer } from "api/services/media/addProduceMediaService"
import { Socket } from "socket.io"


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