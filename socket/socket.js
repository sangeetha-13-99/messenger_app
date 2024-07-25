
const io=require('socket.io')(8000,{
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
    console.log('socket is connecting');

    socket.on('addUser',(userId,userInfo)=>{
        addUser(userId,socket.id,userInfo);
        io.emit('getUser',users);
    });

    socket.on('sendMessage',(data)=>{
        const user=findFriend(data.receiverId);
        console.log(users,"users")
        console.log(data,user);
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
        console.log("message",message,count,"count");
        let id;
        if(count>0){
            if(message && message.length>0){
                id=message[message.length-1].senderId;
                const user=findFriend(id);
                if(user !== undefined){
                    console.log(message.slice(-count),"messages slice")
                    // const seenMessages=message.slice(-count).map(msg=>({
                    //         senderId:msg.senderId,
                    //         senderName:msg.senderName,
                    //         receiverId:msg.receiverId,
                    //         createAt:msg.time,
                    //         _id:msg._id,
                    //         status:'seen',
                    //         message:{
                    //             text:msg.message.text,
                    //             image:msg.message.image
                    //         }
                    // }))
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
})