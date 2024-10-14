import { MUTE_UNMUTE } from "@shared/constants/mediasoupEventConstant";
import { IManageMediaArguments } from "@shared/interfaces/webRTCInterfaces";
import { peers } from "api/constants/variableConstant";
import UserModel from "api/model/userModel";
import { Socket } from "socket.io";


export const manageMedia = async ({value, type, socketId}:IManageMediaArguments,socket:Socket) => {
    try {
        const peer:UserModel = peers.get(socket.id);
        if(type == 'mic'){
            peer.isMicMute = value;
        }else{
            peer.isWebCamMute = value;
        }
        peers.set(socketId,peer);
        const room_id = peer.room_id;
        socket.to(room_id).emit(MUTE_UNMUTE,{value,type,socketId});
    } catch (error) {
        console.log('Getting Error while manage media: ',(error as Error).message);
    }
}