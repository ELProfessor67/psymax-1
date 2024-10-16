import * as mediasoup from 'mediasoup'
import { IceCandidate } from 'mediasoup/node/lib/fbs/web-rtc-transport'
import { Transport } from 'mediasoup-client/lib/types'
import * as mediasoupClient from 'mediasoup-client'

export interface IRoomArguments {
    room_id: string;
    username: string;
    isMicMute: boolean;
    isWebCamMute: boolean
}

export interface ITransportFunctionArguments {
    consumer: boolean
}

export interface IPramas {

    id?: string;
    iceParameters?: mediasoup.types.IceParameters;
    iceCandidates?: mediasoup.types.IceCandidate[];
    dtlsParameters?: mediasoup.types.DtlsParameters;
    error?: string
}


export interface IProceTransportAguments {
    kind: mediasoup.types.MediaKind;
    rtpParameters: mediasoup.types.RtpParameters;
    appData: mediasoup.types.AppData
}

export interface IProducerIds {
    producerId: string;
    socketId: string;
}



export interface IComsumeMediaArgument {
    rtpCapabilities: mediasoup.types.RtpCapabilities;
    remoteProducerId: string;
    serverConsumerTransportId: string;
}


export interface IManageMediaArguments {
    value: boolean;
    type: 'mic' | 'cam';
    socketId: string;
}

export interface IManageAudioArguments {
    value: boolean,
    type: 'mic' | 'cam' | 'screen',
    socketId: string
}


export interface IConsumingTransport {
    consumerTransport: Transport
    serverConsumerTransportId: string
    producerId: string
    consumer: mediasoupClient.types.Consumer,
    socketId: string
}


export interface IProducerData {
    producerId: string
    socketId: string
}