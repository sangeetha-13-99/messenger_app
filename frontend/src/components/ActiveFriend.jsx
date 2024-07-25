import React from 'react';
import { setCurrentFriend } from '../store/messengerSlice';
import { useDispatch } from 'react-redux';

const ActiveFriend = ({user}) => {

  const dispatch=useDispatch();
  return (
    <div className='active-friend' onClick={()=> dispatch(setCurrentFriend({currentFriend:user.userInfo}))}>
        <div className='image-active-icon'>
          <div className='image'>
            <img src={`/image/${user.userInfo.image}`} alt={user.userInfo.userName}/>
            <div className='active-icon'></div>
          </div>
        </div>
    </div>
  )
}

export default ActiveFriend