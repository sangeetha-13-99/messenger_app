const express = require('express');
const app=express();
const dotenv=require('dotenv');
const bodyParser=require('body-parser');
const cookieParser=require('cookie-parser');
const path=require("path");
dotenv.config({
    path:'backend/config/config.env'
});
const authRouter=require('./routes/authRoute');
const messengerRouter=require('./routes/messengerRoute');


app.use(bodyParser.json({ limit: '50mb' }));
app.use(cookieParser());
app.use('/api/messenger',authRouter,messengerRouter);

const __dirname1=path.resolve();
if(process.env.NODE_ENV==='production'){
    app.use(express.static(path.join(__dirname1,"/frontend/build")));
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname1,'frontend','build','index.html'));
    })
}else{
    app.get('/',(req,res)=>{
        res.send('ok');
    });
}

const PORT=process.env.PORT || 5000;
const dataBaseConnection=require('./config/database');
dataBaseConnection();
const server=app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});


const io=require('socket.io')(server,{
    cors:{
        origin:'*',
        methods:['GET','POST']
    }
});


let users=[];
const addUser=(userId,socketId,userInfo)=>{
    const checkUser=users.some(user=>user.userId===userId);
    if(!checkUser){
        users.push({userId,socketId,userInfo});
    }
}

const removeUser=(id)=>{
    users=users.filter(user=>user.userId!==id);
}

const userRemove=(socketId)=>{
    users=users.filter(user=>user.socketId!==socketId);
}

const findFriend=(id)=>{
    return users.find(user=>user.userId===id);
}


io.on('connection',(socket)=>{
    console.log('socket is connected')
    socket.on('addUser',(userId,userInfo)=>{
        addUser(userId,socket.id,userInfo);
        io.emit('getUser',users);
    });

    socket.on('sendMessage',(data)=>{
        const user=findFriend(data.receiverId);
        if(user !== undefined){
            socket.to(user.socketId).emit('getMessage',{
                senderId:data.senderId,
                senderName:data.senderName,
                receiverId:data.receiverId,
                createAt:data.time,
                _id:data._id,
                status:data.status,
                message:{
                    text:data.message.text,
                    image:data.message.image
                }
            })
        }
    });

    socket.on('typingMessage',(data)=>{
        const user=findFriend(data.receiverId);
        if(user !== undefined){
            socket.to(user.socketId).emit('typingMessageGet',{
                senderId:data.senderId,
                receiverId:data.receiverId,
                msg:data.message
            });
        }
    })

    socket.on('seenMessage',({message,count})=>{
        let id;
        if(count>0){
            if(message && message.length>0){
                id=message[message.length-1].senderId;
                const user=findFriend(id);
                if(user !== undefined){
                    socket.to(user.socketId).emit('getSeenMessage',{message:message[message.length-1],count});
                }
            }
        }
    })

    socket.on('logout',(userId)=>{
        removeUser(userId);
        io.emit('getUser',users);
    })

    socket.on('disconnect',()=>{
        userRemove(socket.id);
        io.emit('getUser',users);
    })
});