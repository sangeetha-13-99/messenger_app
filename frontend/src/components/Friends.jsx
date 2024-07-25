import React from 'react';
import moment from 'moment';
// import { useSelector } from 'react-redux';
import { BiCheck, BiCheckDouble } from 'react-icons/bi';
import { useSelector } from 'react-redux';

const Friends = ({friend,myId}) => {
    const {activeUser}=useSelector(state=>state.messenger);
    const {fndInfo,msgInfo,unseenCount}=friend;


  return (
    <div className='friend'>
        <div className='friend-image'>
            <div className='image'>
                <img src={`/image/${fndInfo.image}`} alt={fndInfo.userName}/>
                {activeUser && activeUser.some(user=>user.userInfo._id===fndInfo._id) && <div className='active-icon'></div>}
            </div>
        </div>
        <div className='friend-name-seen'>
            <div className='friend-name'>
                <h4 className={(msgInfo && (msgInfo.senderId===fndInfo._id) && (msgInfo.status==='unseen'))?'unseen-message':''}>{fndInfo.userName}</h4>
                <p className='friend-moment'>
                    <span>
                        ~{msgInfo ? moment(msgInfo.createdAt).startOf('mini').fromNow() : moment(fndInfo.createdAt).startOf('mini').fromNow() }
                    </span> 
                    <span>
                        {
                            myId!==msgInfo?.senderId && unseenCount>0 &&
                            <div className='seen-unseen-icon'>
                                <div className='seen-icon'>
                                    {unseenCount}
                                </div>
                            </div>
                        }
                    </span>
                </p>
            </div>
            <div className='friend-outer'>
                <p className='friend-message'>
                {msgInfo && (msgInfo.senderId===fndInfo._id?<span>{fndInfo.userName} : </span>:
                    <>
                    {
                        msgInfo.status==='seen'?<BiCheckDouble className='check-icon seen'/>:msgInfo.status==='delivered'?<div className='delivered'><BiCheck className='check-icon'/></div>:<BiCheckDouble className='check-icon'/>
                    }
                    </>
                )
                }
                {msgInfo && (msgInfo.message.text?<span>{msgInfo.message.text.slice(0,12)}{msgInfo.message.text.length>11?'...':''}</span>:(msgInfo.message.image?<span>sent an Image</span>:''))}
                {msgInfo == null && <span>connected</span>}
                </p>
                

            </div>
        </div>
    </div>
  )
}

export default Friends