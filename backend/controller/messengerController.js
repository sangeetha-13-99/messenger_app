const formidable=require('formidable');
const fs=require('fs');

const registerModel=require('../models/authModel');
const messageModel=require('../models/messageModel');
const cloudinary=require('../config/cloudinary');

const getLastMessage = async(myId,fdId)=>{
    const lastMessage=await messageModel.findOne({
        $or:[
        {
            $and:[{
                senderId:{
                    $eq:myId
                }},{
                receiverId:{
                    $eq:fdId
                }
            }]
        },
        {
            $and:[{
                senderId:{
                    $eq:fdId
                }
            },{
                receiverId:{
                    $eq:myId
                }
            }]
        }
        ]
    }).sort({
        updatedAt:-1
    });
    return lastMessage;
}

const getUnseenCount = async(senderId,receiverId)=>{
    const messages=await messageModel.find({
                    $and:[{
                    senderId:{
                        $eq:senderId
                    }},{
                    receiverId:{
                        $eq:receiverId
                    }},{
                        status:{
                            $eq:'unseen'
                        }
                    }
                ]
        });
    return messages?messages.length:0;
        
}


const getFriendsFunction=async(myId)=>{
    const users=await registerModel.find({_id:{$ne:myId}});
    let friendMessage=[];
    for (let i=0;i<users.length;i++){
        const unseenCount=await getUnseenCount(users[i].id,myId);
        const lastMessage=await getLastMessage(myId,users[i].id);
        friendMessage=[...friendMessage,{
            fndInfo:users[i],
            msgInfo:lastMessage,
            unseenCount:unseenCount
        }]
    } 
   
    return friendMessage;
}

module.exports.getFriends=async (req,res)=>{
    try{
        const friendMessage=await getFriendsFunction(req.myId);
        if(friendMessage.length>0){
            res.status(200).json({
                success:true,
                friends:friendMessage
            })
        }
    }catch(error){
        res.status(500).json({
            error:{
                errorMessage:['Internal server error']
            }
        })
    }
}

module.exports.sendMessage=async (req,res)=>{
    const senderId=req.myId;

    const form=new formidable.IncomingForm();

    form.parse(req,async(err,fields,files)=>{
        const [senderName,receiverId,text,imageName]=[fields["senderName"][0],fields["receiverId"][0],fields["textMessage"][0],fields["imageName"][0]];
        try{
            if(imageName){
                const result = await cloudinary.uploader.upload(files.imageMessage[0].filepath);
                if(result){
                    const insertMessage=await messageModel.create({
                        senderId,
                        senderName,
                        receiverId,
                        imageName,
                        message:{
                            text:text,
                            image:result.secure_url
                        }
                    });
                    res.status(201).json({
                        success:true,
                        message:insertMessage
                    });
                }
            }else{
                const insertMessage=await messageModel.create({
                    senderId,
                    senderName,
                    receiverId,
                    imageName,
                    message:{
                        text:text,
                        image:''
                    }
                });
                res.status(201).json({
                    success:true,
                    message:insertMessage
                });
            }
        }catch(error){
            res.status(500).json({
                error:{
                    errorMessage:['Internal server error']
                }
            })
        }
    })
}

const getMessages=async(userId,friendId)=>{
    try{
        const messages=await messageModel.find({
                $or:[{
                    $and:[{
                        senderId:{
                            $eq:userId
                        }
                    },{
                        receiverId:{
                            $eq:friendId
                        }
                    }]
                },{
                    $and:[{
                        senderId:{
                            $eq:friendId
                        }
                    },{
                        receiverId:{
                            $eq:userId
                        }
                    }]
                }]
        
            });
        return messages;
    }catch(error){
        throw new Error();
    }

}

module.exports.getMessage=async (req,res)=>{
    const {id:friendId}=req.params;
    const userId=req.myId;
    try{
        const messages=await getMessages(userId,friendId);
        // const flteredMessage=messages.filter((message)=>((message.senderId===userId && message.receiverId===friendId)||(message.senderId===friendId && message.receiverId===userId)));
        res.status(200).json({
            success:true,
            message:messages
        })
    }catch(error){
        res.status(500).json({
            error:{
                errorMessage:['Internal Service Error']
            }
        })
    }
}

const getLastMessageId=async(receiverId,senderId)=>{
    const lastMessage=await messageModel.findOne({
        $and:[{
                senderId:{
                    $eq:senderId
                }
            },{
                receiverId:{
                    $eq:receiverId
                }
            }]
    }).sort({
        updatedAt:-1
    });
    return lastMessage.id;
}

module.exports.seenMessage=async (req,res)=>{
    const {receiverId,senderId}=req.body;
    
    try{
        await messageModel.updateMany({
            $and:[
                {senderId:{$eq:senderId}},
                {receiverId:{$eq:receiverId}},
                {status:{$eq:'unseen'}}
            ]
        },{
            status:'seen'
        },{new:true});

        const messages=await getMessages(receiverId,senderId);
        const friends=await getFriendsFunction(req.myId);
        const friend=friends.find(fnd=>fnd.fndInfo.id===senderId);
    
        res.status(200).json({
            success:true,
            messages,
            friend
        });
    
    }catch(error){
        res.status(500).json({
            error:{
                errorMessage:[error]
            }
        })
    }
}


