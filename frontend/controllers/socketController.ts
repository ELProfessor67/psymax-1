import { Socket } from "socket.io-client";
import SocketService from "../services/socketService";
import { MutableRefObject } from "react";

const socketService = new SocketService();

export const handleInitSocket = (socketRef:MutableRefObject<Socket>) => {
    socketService.initSocket(socketRef);
}
