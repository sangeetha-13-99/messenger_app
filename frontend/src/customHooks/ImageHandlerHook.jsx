import { useState } from "react";
import { useDispatch } from "react-redux";
import { setModal } from "../store/messengerSlice";

const useImageHandlerHook = (state,setState) => {
  const [loadImage,setLoadImage]=useState('');
  const dispatch=useDispatch();
  const fileHandle=(e)=>{
    if(e.target.files.length !==0 ){
      if(state && e.target.name in state){
        setState({...state,
            [e.target.name]:e.target.files[0]
        })
      }else{
        setState(e.target.files[0]);
        dispatch(setModal(true));
      }

      const reader=new FileReader();
      reader.onload=()=>{
          setLoadImage(reader.result);
      }
      reader.readAsDataURL(e.target.files[0]);
    }else{
      setLoadImage('');
    }

  }

  return [loadImage,fileHandle];
}

export default useImageHandlerHook;