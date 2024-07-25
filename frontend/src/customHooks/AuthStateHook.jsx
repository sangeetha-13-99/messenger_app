import React, { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import { toast} from 'react-toastify';
import useSound from 'use-sound';

import notificationSound from '../audio/notification.mp3';

import {resetMessage} from "../store/authSlice";


const useAuthStateHook = (initialState,navigateTo) => {
    const [notificationsSoundPlay]=useSound(notificationSound);
    const {error,successMessage}=useSelector(state=>state.auth);
    const [state,setState]=useState(initialState);
    const dispatch=useDispatch();
    const navigate=useNavigate();

    useEffect(()=>{
        if(successMessage){
            notificationsSoundPlay();
            toast.success(successMessage);
            navigate('/'+navigateTo);
        }else if(error){
            notificationsSoundPlay();
            error.forEach((err)=>{
                toast.error(err);
            });
        }
        dispatch(resetMessage());

    },[successMessage,error])

    return {state,setState}

  
}

export default useAuthStateHook;