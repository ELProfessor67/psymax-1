import { MutableRefObject } from "react";
import UserService from "../services/userService";
import { Socket } from "socket.io-client";

const userService = new UserService();

export const handleUserJoin = async (username: string, room_id: string, isMicMute: boolean, isWebCamMute: boolean, socketRef: MutableRefObject<Socket>): Promise<boolean> => {
  try {
    const result = await userService.userJoin(socketRef, room_id, username, isMicMute, isWebCamMute);
    if (result) {
      console.log(`User ${username} successfully joined.`);
      return true;
    } else {
      console.log(`Failed to join user ${username}.`);
      return false;
    }
  } catch (error) {
    console.error(`Error joining user ${username}:`, error);
    return false;
  }
};

export const handleUserLeave = async (socketRef: MutableRefObject<Socket>, room_id: string): Promise<boolean> => {
  try {
    const result = await userService.userLeave(socketRef, room_id);
    return true;
  } catch (error) {
    console.error("Error leaving the room:", error);
    return false;
  }
};

export const getUserInfo = async (userId: string, socketRef: MutableRefObject<Socket>): Promise<any> => {
  try {
    const userInfo = await userService.getUserInfo(socketRef, userId);
    if (userInfo) {
      console.log("User info retrieved successfully.");
      return userInfo;
    } else {
      console.log("Failed to retrieve user info.");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving user info:", error);
    return null;
  }
};