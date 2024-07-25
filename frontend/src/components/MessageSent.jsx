import { FaFileImage, FaGift, FaPlusCircle } from "react-icons/fa";

import InputBox from '../common/InputBox';
// import { useDispatch } from "react-redux";
import { useRef } from "react";



const MessageSent = ({imageHandler}) => {
    const fileRef=useRef(null);

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
            <input type="file" ref={fileRef} onChange={fileHandler} style={{display:'none'}}/>
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