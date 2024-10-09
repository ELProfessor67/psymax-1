import { rooms } from 'api/constants/variableConstant';
import * as mediasoup from 'mediasoup'
import Room from "../../processors/user/manageRoomProcessor";
import mediasoupService from "../../processors/webrtc/createMediasoupProcessor.js";

export const createRoomServer = async (room_id: string, socketId: string): Promise<mediasoup.types.Router>  => {
    let router: mediasoup.types.Router;
    if (rooms.get(room_id)) {
        const roomRef: Room = rooms.get(room_id);
        roomRef.addParticipants(socketId);
        router = roomRef.router;
    } else {
        router = await mediasoupService.getRouter();
        const newRoom = new Room(router, socketId);
        rooms.set(room_id, newRoom)
    }
    return router;
}