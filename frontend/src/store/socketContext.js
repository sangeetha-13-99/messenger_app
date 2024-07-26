
import {io} from 'socket.io-client';
import { createContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveUser, seenMessage, setSocketMessage, updateFriend, setSeenSocketMessage } from "./messengerSlice";
import { toast} from 'react-toastify';
import useSound from 'use-sound';

import notificationSound from '../audio/notification.mp3';
import globalConstants from '../utils/constants';


export const SocketContext=createContext({
    socket:null,
    typingMessage:null
});

const SocketContextProvider=({children})=>{
    const [notificationsSoundPlay]=useSound(notificationSound);

    const socket=useRef();
    const {currentUserInfo}=useSelector(state=>state.auth);
    const {currentFriend,messageSentSucess,message,messageGetSucess,friends}=useSelector(state=>state.messenger);
    const [sMessage,setSMessage]=useState(null);
    const [typingMessage,setTypingMessage]=useState(null);
    const [seenSMessage,setSeenSMessage]=useState(null);
    const dispatch=useDispatch();


    useEffect(()=>{
        socket.current=io('ws://localhost:8000');
        socket.current.on('getMessage',(data)=>{
            setSMessage(data);
        });
        socket.current.on('typingMessageGet',(data)=>{
            setTypingMessage(data);
        });
        socket.current.on('getSeenMessage',(data)=>{
            setSeenSMessage(data);
        });
    },[]);

    useEffect(()=>{
        socket.current.emit('addUser',currentUserInfo._id,currentUserInfo);
    },[]);

    useEffect(()=>{
        socket.current.on('getUser',(users)=>{
            const filterUser=users.filter(user=>user.userId !== currentUserInfo._id);
            dispatch(setActiveUser({activeUser:filterUser}));
        })
    },[]);

    useEffect(()=>{
        if(sMessage && sMessage._id && currentFriend){
            if(sMessage.senderId === currentFriend._id && sMessage.receiverId === currentUserInfo._id){
                const getFriend=friends.find(fnd=>fnd.fndInfo._id===currentFriend._id);
                dispatch(setSocketMessage({socketMessage:sMessage}));
                dispatch(seenMessage({receiverId:currentUserInfo._id,senderId:currentFriend._id}));
                dispatch(updateFriend({msgInfo:sMessage,sender:false}));
                socket.current.emit('seenMessage',{message:[sMessage],count:getFriend.unseenCount+1});
            }
            else if(sMessage.senderId !== currentFriend._id && sMessage.receiverId===currentUserInfo._id){
                notificationsSoundPlay();
                toast.success(`${sMessage.senderName} Sent Message`);
                dispatch(updateFriend({msgInfo:sMessage,sender:false}));
            }
        }
    },[sMessage?._id]);

    useEffect(()=>{
        if(messageSentSucess){
            socket.current.emit('sendMessage',message[message.length-1]);
            dispatch(updateFriend({msgInfo:message[message.length-1],sender:true}));
        }
    },[messageSentSucess]);

   

    useEffect(()=>{
        if(messageGetSucess && currentFriend._id && message && message.length>0){
            if(message[message.length-1].senderId===currentFriend._id && message[message.length-1].status==='unseen'){
                const getFriend=friends.find(fnd=>fnd.fndInfo._id===currentFriend._id);
                dispatch(seenMessage({receiverId:currentUserInfo._id,senderId:currentFriend._id}));
                dispatch(updateFriend({msgInfo:message[message.length-1],sender:false}));
                socket.current.emit('seenMessage',{message,count:getFriend.unseenCount});
            }
        }
    },[messageGetSucess])

    useEffect(()=>{
        if(seenSMessage && seenSMessage.message){
            dispatch(setSeenSocketMessage({message:seenSMessage.message,count:seenSMessage.count}));
        }
    },[seenSMessage?.message?._id]);

    return (
        <SocketContext.Provider value={{socket,typingMessage}}>
            {children}
        </SocketContext.Provider>
    )
}

export default SocketContextProvider;