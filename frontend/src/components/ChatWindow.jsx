import React, { Fragment, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { FaPhoneAlt, FaRocketchat, FaVideo } from "react-icons/fa";
import Message from "./Message";
import MessageSent from "./MessageSent";
import FriendInfo from "./FriendInfo";
import MessageModal from "./MessageModal";
import useImageHandlerHook from "../customHooks/ImageHandlerHook";


const ChatWindow = () => {
  const {currentFriend,showModal,activeUser}=useSelector(state=>state.messenger);
  const [state,setState]=useState('');
  const [loadImage,fileHandle]=useImageHandlerHook(state,setState);

  

  return (
    <div className="col-9">
      <div className="right-side">
        <input type="checkbox" id="dot" />
        <div className="row">
          <div className="col-8">
            <div className="message-send-show">
              <div className="header">
                <div className="image-name">
                  <div className="image">
                    <img src={`${currentFriend.image}`} alt={currentFriend.userName} />
                    {activeUser && activeUser.length>0 && activeUser.some(user=>user.userId===currentFriend._id) && <div className='active-icon'></div>}
                  </div>
                  <div className="name">
                    <h3>{currentFriend.userName}</h3>
                  </div>
                </div>
                <div className="icons">
                  <div className="icon" style={{opacity:0.4,cursor:'auto'}}>
                    <FaPhoneAlt />
                  </div>
                  <div className="icon" style={{opacity:0.4,cursor:'auto'}}>
                    <FaVideo />
                  </div>
                  <div className="icon" style={{opacity:0.4,cursor:'auto'}}>
                    <label htmlFor="dot"><FaRocketchat /></label>
                  </div>
                </div>
              </div>
              <Fragment>
                <Message />
                <MessageSent imageHandler={fileHandle}/>
              </Fragment>
            </div>
          </div>
          <div className="col-4">
            <FriendInfo />
          </div>
        </div>
      </div>
    {showModal && loadImage && <MessageModal image={loadImage} imageFile={state} />}
    </div>
  );
};

export default ChatWindow;
