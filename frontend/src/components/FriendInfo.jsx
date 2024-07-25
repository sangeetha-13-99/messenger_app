import React from "react";
import { FaCaretSquareDown } from "react-icons/fa";
import { useSelector } from "react-redux";

const FriendInfo = () => {
  const {currentFriend,activeUser}=useSelector(state=>state.messenger);

  return (
    <div className="friend-info">
      <input type="checkbox" id="gallery" />
      <div className="image-name">
        <div className="image">
          <img src={`${currentFriend.image}`} alt={currentFriend.userName} />
        </div>
        {activeUser && activeUser.length>0 && activeUser.some(user=>user.userId===currentFriend._id) && <div className="active-user">Active</div>}
        <div className="name">
          <h4>{currentFriend.userName}</h4>
        </div>
      </div>
      <div className="others">
        <div className="custom-chat">
          <h3>Customize Chat</h3>
          <FaCaretSquareDown />
        </div>
        <div className="privacy">
          <h3>Privacy And Support</h3>
          <FaCaretSquareDown />
        </div>
        <div className="media">
          <h3>Shared Media</h3>
          <label htmlFor="gallery">
            <FaCaretSquareDown />
          </label>
        </div>
      </div>
      <div className="gallery">
        <img src="/image/28350krishna.jpg" alt="" />
        <img src="/image/28350krishna.jpg" alt="" />
        <img src="/image/28350krishna.jpg" alt="" />
        <img src="/image/28350krishna.jpg" alt="" />
      </div>
    </div>
  );
};

export default FriendInfo;
