import { transportsContainer } from 'api/constants/variableConstant';
import * as mediasoup from 'mediasoup';
import { Socket } from 'socket.io';

export const connectTransport = async ({ dtlsParameters }:{dtlsParameters: mediasoup.types.DtlsParameters},socket:Socket) => {
    try {
        await transportsContainer.getTranport(socket.id)?.connect({ dtlsParameters });
    } catch (error) {
        console.log('Getting error while connecting transport: ',(error as Error).message)
    }
}