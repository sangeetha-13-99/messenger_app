import axios from "axios";
import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";

const messengerInitialState={
    friendsLoading:'',
    messageLoading:'',
    showModal:false,
    friends:[],
    currentFriend:{},
    activeUser:[],
    message:[],
    messageSentSucess:false,
    messageGetSucess:false,
    errorMessage:[]
}

export const getFriends=createAsyncThunk(
    'messenger/getFriends',async(_,thunkApi)=>{
        try{
            const response=await axios.get('api/messenger/get-friends');
            return response.data;
        }catch(error){
            return thunkApi.rejectWithValue(error.response.data.error);
        }
    }   
);

export const sendMessage=createAsyncThunk(
    'messenger/sendMessage',async(data,thunkApi)=>{
        try{
            const response=await axios.post('api/messenger/send-message',data);
            return response.data;
        }catch(error){
            return thunkApi.rejectWithValue(error.response.data.error);
        }
    }   
);

export const getMessage=createAsyncThunk(
    'messenger/getMessage',async(data,thunkApi)=>{
        try{
            const response=await axios.get(`api/messenger/get-message/${data}`,data);
            return response.data;
        }catch(error){
            return thunkApi.rejectWithValue(error.response.data.error);
        }
    }   
);

export const seenMessage=createAsyncThunk(
    'messenger/seenMessage',async(data,thunkApi)=>{
        try{
            const response=await axios.post(`api/messenger/seen-message`,data);
            return response.data
        }catch(error){
            return thunkApi.rejectWithValue(error.response.data.error);
        }
    }
)


const messenger=createSlice({
    name:'messenger',
    initialState:messengerInitialState,
    reducers:{
        resetErrorMessage:(state)=>{
            state.errorMessage=[];
        },
        setModal:(state,{payload})=>{
            state.showModal=payload;
        },
        setCurrentFriend:(state,{payload})=>{
            state.currentFriend=payload.currentFriend;
        },
        setActiveUser:(state,{payload})=>{
            state.activeUser=payload.activeUser;
        },
        setSocketMessage:(state,{payload})=>{
            state.message.push(payload.socketMessage);
           
        },
        setSeenSocketMessage:(state,{payload})=>{
            for(let cnt=payload.count;cnt>0;cnt--){
                state.message[state.message.length-cnt].status='seen';
            }
            state.friends=state.friends.map(fnd=>{
                if(fnd.fndInfo._id===payload.message.receiverId){
                    fnd.msgInfo=payload.message;
                    fnd.msgInfo.status='seen';
                }
                return fnd;
            })
        },
        updateFriend:(state,{payload})=>{
            if(payload.sender){
                const index=state.friends.findIndex(friend=>friend.fndInfo._id === payload.msgInfo.receiverId);
                state.friends[index].msgInfo=payload.msgInfo;
                state.friends[index].unseenCount=0;
            }else{
                const index=state.friends.findIndex(friend=>friend.fndInfo._id === payload.msgInfo.senderId);
                state.friends[index].msgInfo=payload.msgInfo;
                if(state.friends[index].fndInfo._id === state.currentFriend._id){
                    state.friends[index].unseenCount=0;
                }else{
                    state.friends[index].unseenCount=state.friends[index].unseenCount+1;
                }
            }
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(getFriends.pending,(state)=>{
            state.friendsLoading=true;
        }).addCase(getFriends.fulfilled,(state,{payload})=>{
            state.friendsLoading=false;
            state.friends=payload.friends;
            state.errorMessage=[];
        }).addCase(getFriends.rejected,(state,{payload})=>{
            state.friendsLoading=false;
            state.friends=[];
            state.errorMessage=payload.errorMessage;
        }).addCase(getMessage.pending,(state)=>{
            state.messageLoading=true;
            state.messageGetSucess=false;
        }).addCase(getMessage.fulfilled,(state,{payload})=>{
            state.messageLoading=false;
            state.message=payload.message;
            state.messageGetSucess=true;
            state.errorMessage=[];
        }).addCase(getMessage.rejected,(state,{payload})=>{
            state.messageLoading=false;
            state.message=[];
            state.messageGetSucess=false;
            state.errorMessage=payload.errorMessage;
        }).addCase(sendMessage.pending,(state)=>{
            state.messageLoading=true;
            state.messageSentSucess=false;
        }).addCase(sendMessage.fulfilled,(state,{payload})=>{
            state.messageLoading=false;
            state.messageSentSucess=true;
            state.message.push(payload.message);
            state.errorMessage=[];
        }).addCase(sendMessage.rejected,(state,{payload})=>{
            state.messageLoading=false;
            state.messageSentSucess=false;
            state.errorMessage=payload.errorMessage;
        })
        .addCase(seenMessage.fulfilled,(state,{payload})=>{
            state.message=payload.messages;
            state.friends=state.friends.map(frnd=>{
                if(frnd.fndInfo._id===payload.friend.fndInfo._id){
                    return payload.friend;
                }
                return frnd;
            });
        })
    }
});

export const {resetErrorMessage,setModal,setCurrentFriend,setActiveUser,setSocketMessage,updateFriend,setSeenSocketMessage}=messenger.actions;
export default messenger.reducer;