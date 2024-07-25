import React, { Fragment, useState,useContext } from 'react'
import { FaPaperPlane } from 'react-icons/fa';
import {MdEmojiEmotions} from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import {  SocketContext } from '../store/socketContext';
import useSound from 'use-sound';

import globalConstants from '../utils/constants';
import { sendMessage,setModal } from '../store/messengerSlice';
import messageSound from '../audio/message.mp3';

const InputBox = ({image,imageFile}) => {
    const {currentUserInfo}=useSelector(state=>state.auth);
    const {currentFriend,}=useSelector(state=>state.messenger);
    const [inboxMessage,setInboxMessage]=useState('');
    const dispatch=useDispatch();
    const {socket}=useContext(SocketContext);
    const [messagesSoundPlay]=useSound(messageSound);

    
    const inputChangeHandler=(e)=>{
        setInboxMessage(e.target.value);
        socket.current.emit('typingMessage',{
            senderId:currentUserInfo._id,
            receiverId:currentFriend._id,
            message:e.target.value
        })

    }
    const sendMessageHandler=()=>{
        messagesSoundPlay();
        let imageName="";
        if(imageFile){
            imageName=Date.now()+(imageFile.name);
        }
        const formData=new FormData();
        formData.append('senderName',currentUserInfo.userName);
        formData.append('receiverId',currentFriend._id);
        formData.append('imageName',imageName)
        formData.append('imageMessage',imageFile?imageFile:'');
        formData.append('textMessage',inboxMessage?inboxMessage:'');

        socket.current.emit('typingMessage',{
            senderId:currentUserInfo._id,
            receiverId:currentFriend._id,
            message:''
        })
    
        dispatch(sendMessage(formData));
        setInboxMessage('');
        dispatch(setModal(false));
    }
    const emojiHandler=(emoji)=>{
        setInboxMessage(inboxMessage+emoji);
        socket.current.emit('typingMessage',{
            senderId:currentUserInfo._id,
            receiverId:currentFriend._id,
            message:emoji
        })
    }

  return (
    <Fragment>
          <input type="checkbox" id="emoji" />
        <div className="message-type">
                <input type="text" name="message" id="message" placeholder='Type Here...' className='form-control' value={inboxMessage} onChange={inputChangeHandler}/>
                <div className="file hover-gift" >
                    <label htmlFor="emoji">
                        <MdEmojiEmotions />
                    </label>
                </div>
        </div>
        <div className="file" style={{opacity:(imageFile || inboxMessage)?1:0.4,cursor:(imageFile || inboxMessage)?'pointer':'auto'}} onClick={()=>{
            if(imageFile || inboxMessage){
                sendMessageHandler();
            }
        }}>
            <FaPaperPlane />
        </div>
        <div className="emoji-section">
            <div className="emoji">
                {
                globalConstants.emojis.map((emoji)=>{
                    return <span onClick={()=>emojiHandler(emoji)}>{emoji}</span>
                })
                }
            </div>
        </div>
    </Fragment>
  )
}

export default InputBox