import { MutableRefObject } from "react";
import { io, Socket } from "socket.io-client";
import { ChatClientToServerEvents,ChatServerToClientEvents } from '../types/chatSocketType';
import { useCallback, useEffect, useRef, useState } from "react";
import { JOIN_ROOM, MESSAGE } from "@shared/constants/chatEventsConstant";
import { IUserMessage } from "../components/ChatSidebarComponent";
import ChatService from "../services/chatService";

const chatService = new ChatService();

export const connectSocket = (chatSocketRef:MutableRefObject<Socket<ChatServerToClientEvents, ChatClientToServerEvents> | null>,chatSocketIdRef:MutableRefObject<string | null>,room_id:string,name:string) => {
    try {
        chatService.initChatSocker(chatSocketRef,chatSocketIdRef,room_id,name);
    } catch (error) {
        console.log((error as Error).message)
    }
}

export const sendMessage = (chatSocketRef:MutableRefObject<Socket<ChatServerToClientEvents, ChatClientToServerEvents> | null>,room_id:string,name: string, text: string) => {
    chatService.sendMessage(chatSocketRef,room_id,name,text);
}

export const onMessage = (chatSocketRef:MutableRefObject<Socket<ChatServerToClientEvents, ChatClientToServerEvents> | null>,setMessages:React.Dispatch<React.SetStateAction<IUserMessage[]>>,socketIdRef:MutableRefObject<string | null>) => {
    chatService.onMessage(chatSocketRef,setMessages,socketIdRef);
}


// This custom hook is used to manage multiple states to keep the chat component  clean and organized.
// Instead of cluttering the chat component with too many useState calls, we handle all related state logic here.
// This approach improves readability and maintainability.
const useChatStateManage = (name:string,room_id:string,setMessages:React.Dispatch<React.SetStateAction<IUserMessage[]>>) => {
  const chatSocketIdRef = useRef<string | null>(null)
  const chatSocketRef = useRef<null | Socket<ChatServerToClientEvents, ChatClientToServerEvents>>(null);



  useEffect(() => {
    connectSocket(chatSocketRef,chatSocketIdRef,room_id,name);
  }, [chatService]);

  useEffect(() => {
    onMessage(chatSocketRef,setMessages,chatSocketIdRef);

    return () => {
      chatSocketRef.current?.off(MESSAGE);
    }
  },[chatSocketRef.current])

  const handleMessageSend = useCallback((text:string) => {
   
    sendMessage(chatSocketRef,room_id,name,text);
  },[chatSocketRef.current,name,room_id]);

  return {handleMessageSend}
}

export default useChatStateManage