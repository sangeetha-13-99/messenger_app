import React, { useContext, useEffect, useState } from 'react';
import {FaEdit,FaSistrix} from 'react-icons/fa';
import { FiLogOut } from "react-icons/fi";
import { useDispatch, useSelector } from 'react-redux';


import Friends from './Friends';
import ChatWindow from './ChatWindow';
import { getFriends, getMessage,setCurrentFriend } from '../store/messengerSlice';
import { userLogout } from '../store/authSlice';
import { SocketContext } from '../store/socketContext';


const Messenger = () => {
    
    const {friends,currentFriend}=useSelector(state=>state.messenger);
    const {currentUserInfo}=useSelector(state=>state.auth);
    const dispatch=useDispatch();
    const {socket}=useContext(SocketContext);
    const [filterFriend,setFilterFriend]=useState(null);
    
    useEffect(()=>{
        dispatch(getFriends());
    },[]);

    useEffect(()=>{
        setFilterFriend(friends)
    },[friends])

 
    useEffect(()=>{
        if(currentFriend && currentFriend._id){
            dispatch(getMessage(currentFriend._id));
        }
    },[currentFriend?._id]);

    const logOutHandler=()=>{
        dispatch(userLogout());
        socket.current.emit('logout',currentUserInfo._id);
    }

    const searchHandler=(event)=>{
        if(friends && friends.length>0){
            const filterFriends=friends.filter(({fndInfo})=>fndInfo.userName.toLowerCase().includes(event.target.value.toLowerCase()));
            if(filterFriends.length===0){
                setFilterFriend(friends);
            }else{
                setFilterFriend(filterFriends);
            }
        }
    }

    const debounce=(callback)=>{
        let timer;
        return function(event){
            clearTimeout(timer);
            timer=setTimeout(()=>{
                callback(event);
            },500);
        }
    }

    const debounceHandler=debounce(searchHandler);

  return (
    currentUserInfo?._id  && (<div className='messenger'>
        <div className='row'>
            <div className='col-3'>
                <div className='left-side'>
                    <div className='top'>
                        <div className='image-name'>
                            <div className='image'>
                                <img src={`${currentUserInfo.image}`} alt={currentUserInfo.userName}/>
                            </div>
                            <div className='name'>
                                <h3>{currentUserInfo.userName}</h3>
                            </div>
                            <div className='icons'>
                                <div className='icon' style={{opacity:0.4,cursor:'auto'}}>
                                    <FaEdit/>
                                </div>
                                <div className='icon' onClick={logOutHandler}>
                                    <FiLogOut/>
                                </div>
                            </div>
                        </div>
                    </div>
                     <div className='friend-search'>
                        <div className='search'>
                            <button><FaSistrix/></button>
                            <input type="text" placeholder="Search" className='form-control' onChange={(e)=>debounceHandler(e)}/>
                        </div>
                     </div>
   
                    <div className='friends'>
                            {
                                (filterFriend && filterFriend.length>0) ? filterFriend.map((friend)=>
                                    (<div className={`hover-friend ${currentFriend._id===friend.fndInfo._id?"active":""}`} key={friend.fndInfo._id} onClick={()=>{
                                        dispatch(setCurrentFriend({currentFriend:friend.fndInfo}))
                                    }}>
                                        <Friends myId={currentUserInfo._id} friend={friend}/>
                                    </div>)
                                ):'No Friend'
                            }
                    </div>
                </div>
            </div>
           {(currentFriend && currentFriend._id ) ? <ChatWindow /> : 
           <div className='chatwindow'>
                <img src='/image/start-window.webp' alt='start-window' className='chatwindow-image'/>
                <p className='chatwindow-text'> start a Conversation </p>
            </div>}
          
        </div>
    </div>)
  )
}

export default Messenger;