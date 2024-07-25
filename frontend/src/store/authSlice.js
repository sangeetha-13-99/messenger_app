import axios from 'axios';
import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import {jwtDecode} from "jwt-decode"


export const userRegister=createAsyncThunk(
    'auth/userRegister',async(data,thunkApi)=>{
        const config={
            mode:"cors",
            headers:{
                accept:'application/json',
                'Content-Type':'multipart/form-data'
            }
        }
        try{
            const response=await axios.post('api/messenger/user-register',data,config);
            // localStorage.setItem('authToken',response.data.token);
            return response.data;
        }catch(error){
            return thunkApi.rejectWithValue(error.response.data.error);
        }
    }
);


export const userLogin=createAsyncThunk(
    'auth/userLogin',async(data,thunkApi)=>{
        const config={
            mode:"cors",
            headers:{
                accept:'application/json',
            }
        }
        try{
            const response=await axios.post('api/messenger/user-login',data,config);
            localStorage.setItem('authToken',response.data.token);
            return response.data;
        }catch(error){
            return thunkApi.rejectWithValue(error.response.data.error);
        }
    }
)

export const userLogout=createAsyncThunk(
    'auth/userLogout',async(_,thunkApi)=>{
        try{
            const response=await axios.post('api/messenger/user-logout');
            localStorage.removeItem('authToken');
            return response.data;
        }catch(error){
            return thunkApi.rejectWithValue(error.response.data.error);
        }
    }
)

const authInitialState={
    loading:true,
    authenticate:false,
    error:'',
    successMessage:'',
    currentUserInfo:''
}

const tokenDecode=(token)=>{
    const decodedToken=jwtDecode(token);
    const expTime= new Date(decodedToken.exp*1000);
    if(new Date() > expTime){
        return null;
    }
    return decodedToken;
}

const getToken=localStorage.getItem("authToken");
if(getToken){
    authInitialState.loading=false;
    authInitialState.authenticate=true;
    authInitialState.currentUserInfo=tokenDecode(getToken);
}

const auth=createSlice({
    name : 'auth',
    initialState:authInitialState,
    reducers:{
        resetMessage:(state)=>{
            state.successMessage='';
            state.error='';
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(userRegister.pending,(state)=>{
            state.loading=true;
        }).addCase(userRegister.fulfilled,(state,{payload})=>{
            state.successMessage=payload.successMessage;
            state.error='';
            state.loading=false;
        }).addCase(userRegister.rejected,(state,{payload})=>{
            state.successMessage='';
            state.error=payload.errorMessage;
            state.loading=false;
        }).addCase(userLogin.pending,(state)=>{
            state.loading=true;
        }).addCase(userLogin.fulfilled,(state,{payload})=>{
            state.authenticate=true;
            state.successMessage=payload.successMessage;
            state.error='';
            state.currentUserInfo=tokenDecode(payload.token);
            state.loading=false;
        }).addCase(userLogin.rejected,(state,{payload})=>{
            state.authenticate=false;
            state.successMessage='';
            state.error=payload.errorMessage;
            state.currentUserInfo='';
            state.loading=false;
        }).addCase(userLogout.fulfilled,(state,{payload})=>{
            state.authenticate=false;
            state.successMessage=payload.successMessage;
            state.error='';
            state.currentUserInfo='';
        }).addCase(userLogout.rejected,(state,{payload})=>{
            state.error=payload.errorMessage;
            state.successMessage='';
        })
    }
    
});

export const {resetMessage}=auth.actions;
export default auth.reducer;