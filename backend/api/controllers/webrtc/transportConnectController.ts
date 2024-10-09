import { transportsContainer } from "api/constants/variableConstant";
import * as mediasoup from 'mediasoup'

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