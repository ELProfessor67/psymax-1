import { IProducerIds } from "@shared/interfaces/webRTCInterfaces";
import { peers, producersContainer } from "api/constants/variableConstant";
import { IProducerData } from "api/processors/media/createProducersMediaProcessor";
import { Socket } from "socket.io";



export const getProducer = async (callback: (producerIds: IProducerData[]) => void,socket:Socket) => {
    try {
        const room_id = peers.get(socket.id).room_id;
        const producerIds = producersContainer.getAllProducer(room_id, socket.id);
        callback(producerIds);
    } catch (error) {

    }
}