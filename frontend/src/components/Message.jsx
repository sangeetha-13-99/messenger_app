import { BiCheck,BiCheckDouble } from "react-icons/bi";

import React, { Fragment, useContext, useEffect,useRef } from "react";
import { useSelector } from "react-redux";
import globalConstants from "../utils/constants";
import { SocketContext } from "../store/socketContext";
import moment from "moment";

const Message = () => {
  const {message,messageLoading,currentFriend}=useSelector(state=>state.messenger);
  const {currentUserInfo}=useSelector(state=>state.auth);
  const scrollRef=useRef(null);
  const {typingMessage}=useContext(SocketContext);
  
  
  useEffect(()=>{
    scrollRef.current?.scrollIntoView({behavior:'smooth'});
  },[message])


  const structureDate=(date)=>{
    const getDate=Date(date);
    const currentDate=new Date();
    let month=globalConstants.monthsIndex[getDate.substring(4,7)]+1;
    let day=getDate.substring(8,10);
    let year=getDate.substring(11,15);
    
    if(currentDate.getMonth()+1==month && currentDate.getDate()==day && currentDate.getFullYear()==year){
      return 'Today';
    }
    return `${day}/${month}/${year}`;
  }


  return (
    <Fragment>
    <div className="message-show">
      {(message && message.length>0 ? message.map(message=>{
        if(message.senderId===currentUserInfo._id){
          return (<div className="my-message" ref={scrollRef}>
            <div className="image-message-time">
              <div className="my-text">
               {message.message.image && <img className="message-image" src={"/image/"+message.message.image}/>}
                {message.message.text && <p className="message-text">{message.message.text}</p>}
              </div>
              {
                message.status==="seen"?<BiCheckDouble className="check-icon seen"/>:message.status==="delivered"?<BiCheck className="check-icon"/>:<BiCheckDouble className="check-icon"/>
              }
            </div>
            <div className="time">{moment(message.createdAt).startOf('mini').fromNow()}</div>
          </div>)
        }else{
          return (<div className="fd-message" ref={scrollRef}>
            <div className="image-message-time">
              <img className="fd-image" src={`/image/${currentFriend.image}`} alt={currentFriend.userName} />
              <div className="message-time">
                <div className="fd-text">
                {message.message.image && <img className="message-image" src={"/image/"+message.message.image}/>}
                {message.message.text && <p className="message-text">{message.message.text}</p>}
                </div>
                <div className="time">{moment(message.createdAt).startOf('mini').fromNow()}</div>
              </div>
            </div>
          </div>)
        }
      }):
      <Fragment>
        <div className="chatwindow">
          <img className="chatwindow-image" src='/image/conversation.webp'/>
          <p className="chatwindow-text"> say Hi </p>
        </div>
      </Fragment>
      )}
      
    </div>

      {typingMessage && typingMessage.msg && typingMessage.senderId===currentFriend._id && <div className="typing-message">
        <div className="fd-message">
            <div className="image-message-time">
              <img className="fd-image" src={`/image/${currentFriend.image}`} alt={currentFriend.userName} />
              <div className="message-time">
                <div className="fd-text">
                  <p className="time">Typing...</p>
                </div>
              </div>
            </div>
        </div>
      </div>}
    </Fragment>
  );
};

export default Message;
