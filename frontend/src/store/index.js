import {  configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import messengerReducer from './messengerSlice';

const store=configureStore({
    reducer:{
        auth:authReducer,
        messenger:messengerReducer
    }
});

export default store;