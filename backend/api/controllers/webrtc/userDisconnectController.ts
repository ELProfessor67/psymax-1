import { consumerContainer, peers, producersContainer, rooms, transportsContainer } from "api/constants/variableConstant";
import { Server, Socket } from "socket.io";
import RoomService from "../../processors/user/manageRoomProcessor";
import { PARTICIPANTS_DISCONNECT } from "@shared/constants/mediasoupEventConstant";

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