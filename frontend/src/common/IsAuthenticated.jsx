import React, { Fragment, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
// import {Shimmer} from 'react-shimmer';

const IsAuthenticated = ({children}) => {
    const {authenticate}=useSelector(state=>state.auth);
    const navigate=useNavigate();

    useEffect(()=>{
        if(!authenticate) navigate('/login');
    },[authenticate]);

    return (
        authenticate ? (<Fragment>
            {children}
        </Fragment>):null
    )
        
    
}

export default IsAuthenticated