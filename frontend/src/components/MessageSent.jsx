import { FaFileImage, FaGift, FaPlusCircle } from "react-icons/fa";

import InputBox from '../common/InputBox';
// import { useDispatch } from "react-redux";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";



const MessageSent = ({imageHandler}) => {
    const fileRef=useRef(null);
    const {showModal}=useSelector(state=>state.messenger);
 

    useEffect(()=>{
        if(showModal===false){
            fileRef.current.value='';
        }

    },[showModal]);

    const fileHandler=(e)=>{
        imageHandler(e);
    }
  return (
    <div className='message-send-section'>
        <div className="file hover-attachment" style={{opacity:0.4,cursor:'auto'}}>
            <div className="add-attachment">
                Add Attachment
            </div>
            <FaPlusCircle/>
        </div>
        <div className="file hover-image">
            <input type="file" ref={fileRef} onInput={fileHandler} style={{display:'none'}}/>
            <div className="add-image">
                Add Image
            </div>
            <FaFileImage onClick={()=>{
                fileRef.current?.click();
                
            }}/>
        </div>
        <div className="file hover-gift" style={{opacity:0.4,cursor:'auto'}} title="Add gift">
            {/* <div className="add-gift">
                Add Gift
            </div> */}
            <FaGift />
        </div>
        <InputBox/>
    </div>
    
  )
}

export default MessageSent