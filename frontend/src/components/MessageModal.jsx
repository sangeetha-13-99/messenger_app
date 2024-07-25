import React, { useEffect, useRef, useState } from 'react'
import InputBox from '../common/InputBox';

import { FaRegCircleXmark } from "react-icons/fa6";
import { useDispatch } from 'react-redux';
import { setModal } from '../store/messengerSlice';

// import useImageHandlerHook from '../customHooks/ImageHandlerHook';

const MessageModal = ({image,imageFile}) => {
    const modelRef=useRef(null);
    const dispatch=useDispatch();
   
    useEffect(() => {
        if (modelRef.current) {
            mutationObserver.observe(modelRef.current, {
                childList: true,
            subtree: true,
        });

        return () => {
            mutationObserver.disconnect();
        };
    }
    }, []);

    const mutationObserver=new MutationObserver(async () => {
        if(modelRef.current){
        //    if(showModal){
                modelRef.current.style.height="100%";
                modelRef.current.style.display="block";
            // }else{
            //     modelRef.current.style.height="0%";
            //     modelRef.current.style.display="none";
            // }
        }
    });
  

  return (
    <div className='model'>
        <FaRegCircleXmark className='model-close' onClick={()=>dispatch(setModal(false))}/>
        {image && <img src={image} className='model-image'/>}
        <div className='model-show' ref={modelRef}>
        <InputBox image={image} imageFile={imageFile} />
        </div>
    </div>
  )
}

export default MessageModal