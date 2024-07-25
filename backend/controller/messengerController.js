const formidable=require('formidable');
const fs=require('fs');

const registerModel=require('../models/authModel');
const messageModel=require('../models/messageModel');

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
        // console.log(messages)
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
    // const {senderName,receiverId,message:{imageMessage,textMessage}}=req.body;
    const senderId=req.myId;

    const form=new formidable.IncomingForm();

    form.parse(req,async(err,fields,files)=>{
        const [senderName,receiverId,text,imageName]=[fields["senderName"][0],fields["receiverId"][0],fields["textMessage"][0],fields["imageName"][0]];
        try{
            if(imageName && files?.imageMessage){
                files.imageMessage[0].originalFilename=imageName;
                const newPath=__dirname+`/../../frontend/public/image/${imageName}`;

                fs.copyFile(files.imageMessage[0].filepath,newPath,async(error)=>{
                    const insertMessage=await messageModel.create({
                        senderId,
                        senderName,
                        receiverId,
                        imageName,
                        message:{
                            text:text,
                            image:files.imageMessage[0].originalFilename
                        }
                    });
                    // const friends=await getMessageUpdates();
                    res.status(201).json({
                        success:true,
                        message:insertMessage
                    });
                })
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

/*
    todo
    similar to whats app
    
    1. no of unseen messages sent by sender is shown on reciever side green dot 
    2. once receiver saw message all the unseen messages should be made status as seen(while user is active / or user clicks on currentfiend) same should be updated in sender id friends component last message (similar to whats app)
    3. if the user is not active delivered , else if user is active but not seen message unseen 
    4. if user seen ,friends component last message (similar to whats app) by socket


    note :
    1. need to take care of always trigegring of events (seen,delivered when opened the chat only triggered if unseen messages)

*/






//  the msg i have sent have put in friends component as a delivered or viewed (sender : me  is updated as delivered once seen my fnd updated as seen by socket (in db it is updated by dispatch while change of current fnd/on recieve of msg))

//  the msg fnd sent is showed as radhika : hello 
// the message not viewed by me is having green dot with number of messages i have to check
//  once i check the messages green dot disappears 
//  once i check the messages green dot disappears and sender gets the update of message viewed
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


