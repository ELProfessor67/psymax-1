import { IComsumeMediaArgument } from "@shared/types/webRTCTypes";
import { consumerContainer, peers, rooms, transportsContainer } from "api/constants/variableConstant";
import { addConsumer } from "api/services/wrbrtc/addConsumerService";
import { Router } from "mediasoup/node/lib/types";
import { Socket } from "socket.io";


export const consumeMedia = async ({ rtpCapabilities, remoteProducerId, serverConsumerTransportId }:IComsumeMediaArgument, callback: ({params}:{params: any}) => void,socket:Socket) => {
    try {
        const room_id: string = peers.get(socket.id).room_id;
        const router: Router = rooms.get(room_id).router;
        const consumerTransport = transportsContainer.getTransportById(serverConsumerTransportId);
        if(!consumerTransport){
            return
        }

        if (router.canConsume({
            producerId: remoteProducerId,
            rtpCapabilities
        })) {
            // transport can now consume and return a consumer
            const consumer = await consumerTransport?.consume({
                producerId: remoteProducerId,
                rtpCapabilities,
                paused: true,
            })

            if(!consumer){
                return
            }

            consumer.on('transportclose', () => {
                console.log('transport close from consumer')
            })

            consumer.on('producerclose', () => {
                console.log('producer of consumer closed')
                socket.emit('producer-closed', { remoteProducerId })

                consumerTransport.close()

                transportsContainer.removeByTransportId(consumerTransport.id)
                consumer.close()
                consumerContainer.removeByConsumerId(consumer.id)
            })

            addConsumer(consumer, room_id,socket.id);

            // from the consumer extract the following params
            // to send back to the Client
            const params = {
                id: consumer.id,
                producerId: remoteProducerId,
                kind: consumer.kind,
                rtpParameters: consumer.rtpParameters,
                serverConsumerId: consumer.id,
            }

            // send the parameters to the client
            callback({ params })
        }
    } catch (error: any) {
        callback({
            params: {
                error: error
            }
        })
        console.log('Error While Getting Media: ',(error as Error).message)
    }
}