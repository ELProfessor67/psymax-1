import { IRoomArguments } from '@shared/interfaces/webRTCInterfaces'
import { peers, rooms } from 'api/constants/variableConstant';
import { Socket } from 'socket.io';
import * as mediasoup from 'mediasoup';
import UserModel from "../../model/userModel.js";
import { createRoomServer } from 'api/services/room/roomService.js';
import { RtpCapabilities } from 'mediasoup/node/lib/RtpParameters.js';
import { NEW_PARTCIPANT_JOIN } from '@shared/constants/mediasoupEventConstant.js';
import { Request, Response } from "express";
import generateRandomString from "@shared/utils/generateRandomString";

export const joinRoom = async ({ room_id, username, isMicMute, isWebCamMute }: IRoomArguments, callback: (socketId:string,rtpCapabilities:RtpCapabilities,participants:UserModel[]) => void,socket:Socket) => {
    try {
        socket.join(room_id);
        const router = await createRoomServer(room_id, socket.id);
        const isAdmin = rooms.get(room_id) ? false : true;
        const newUser: UserModel = new UserModel(socket.id, isAdmin, username, room_id, isWebCamMute, isMicMute);
        peers.set(socket.id, newUser);
        const rtpCapabilities: mediasoup.types.RtpCapabilities = router.rtpCapabilities;



        const participants: UserModel[] = [];
        peers.forEach((peer: UserModel) => {
            if (peer.room_id == room_id && peer.socketId != socket.id) {
                participants.push(peer);
            }
        })

        console.log(rtpCapabilities, participants, socket.id)
        callback(socket.id, rtpCapabilities, participants);
        // connection.to(room_id).emit(NEW_PARTCIPANT_JOIN, { username, socketId: socket.id,isMicMute,isWebCamMute });
        socket.to(room_id).emit(NEW_PARTCIPANT_JOIN, { username, socketId: socket.id, isMicMute, isWebCamMute });
    } catch (error) {
        console.log('Error while user join room : ',(error as Error).message);
    }
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