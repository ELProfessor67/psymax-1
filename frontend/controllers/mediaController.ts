import { Socket } from "socket.io-client";
import MediaService from "../services/mediaService";
import { ClientToServerEvents, ServerToClientEvents } from "../types/socketType";

const mediaService = new MediaService();

export const handleMute = (type: 'mic' | 'cam', socketId: string,socket:Socket<ServerToClientEvents, ClientToServerEvents>) => {
    mediaService.mute(type, socketId,socket);
}

export const handleUnmute = (type: 'mic' | 'cam', socketId: string,socket:Socket<ServerToClientEvents, ClientToServerEvents>) => {
    mediaService.unmute(type, socketId,socket);
}

export const handleScreenShare = (type: 'share' | 'unshare',socket:Socket<ServerToClientEvents, ClientToServerEvents>) => {
    mediaService.screenShare(type,socket);
}


