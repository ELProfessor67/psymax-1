import { rooms } from 'api/constants/variableConstant';
import * as mediasoup from 'mediasoup'
import Room from "../../processors/user/manageRoomProcessor";
import mediasoupService from "../../processors/webRTC/createMediasoupProcessor.js";
import { Request, Response } from "express";
import generateRandomString from "@shared/utils/generateRandomString";


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


export const createRoom = (req: Request, res: Response) => {
    try {
      const id = generateRandomString();
      res.status(200).json({
        success: false,
        id,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: (error as Error).message,
      });
    }
  };