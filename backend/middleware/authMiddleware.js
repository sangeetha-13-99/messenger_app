const jwt=require('jsonwebtoken');

module.exports.authMiddleware=(req,res,next)=>{
    const {authToken}=req.cookies;
    if(authToken){
        const decodedToken=jwt.verify(authToken,process.env.SECRET);
        req.myId=decodedToken._id;
        next();
    }else{
        res.status(400).json({
            error:{
                errorMessage:['Please Login First']
            }
        })
    }
}
