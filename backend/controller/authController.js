const formidable=require('formidable');
const validator= require('validator');
const registerModel=require('../models/authModel');
const fs=require('fs');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const cloudinary=require('../config/cloudinary');

const createToken=(userCreate)=>{
    const token=jwt.sign({
        _id:userCreate._id,
        email:userCreate.email,
        userName:userCreate.userName,
        image:userCreate.image,
        registerTime:userCreate.createdAt
    },process.env.SECRET,{
        expiresIn:process.env.TOKEN_EXPIRATION
    });
    const options={expires: new Date(Date.now()+ process.env.COOKIE_EXPIRATION*24*60*60*1000)};
    return {token,options};
}


module.exports.userRegister=(req,res)=>{
    const form=new formidable.IncomingForm();

    form.parse(req,async(err,fields,files)=>{
        const [
            userName,email,password,confirmPassword
        ]=[fields["userName"][0],fields["email"][0],fields["password"][0],fields["confirmPassword"][0]];
        const error=[];

        if(!userName){
            error.push('Please Provide your user name')
        }
        if(!email){
            error.push('Please Provide your email');
        }
        if(email && !validator.isEmail(email)){
            error.push('Please Provide valid Email');
        }
        if(!password){
            error.push('Please Provide your password');
        }
        if(!confirmPassword[0]){
            error.push('Please Provide your confirm password ');
        }
        if(password && confirmPassword && confirmPassword!==password){
            error.push('Your Pasword and Confirm Password not same')
        }
        if(password && password.length<6){
            error.push('Your password must be more than 6 Characters');
        }if(Object.keys(files).length===0){
            error.push('Please Provide User Image');
        }if(error.length>0){
            res.status(400).json({
                error:{
                    errorMessage:error
                }
            })
        }else{
            try{
              const checkUser=await registerModel.findOne({
                email:email
              });
              if(checkUser){
                res.status(404).json({
                    error:{
                        errorMessage:['Your email already exist']
                    }
                })
              }else{
                const result = await cloudinary.uploader.upload(files.image[0].filepath);
                if(result){
                    const userCreate=await registerModel.create({
                        userName,
                        email,
                        password:await bcrypt.hash(password,10),
                        image:result.secure_url
                    });

                    res.status(201).json({
                       successMessage:'Your Registration is Successful',
                    });
                    console.log('registration completed');

                }else{
                    res.status(500).json({
                        error:{
                            errorMessage:['Unable to Upload Image']
                        }
                    })
                }
            }
            }catch(error){
                console.log(error)
                res.status(500).json({
                    error:{
                        errorMessage:['Internal Server Error']
                    }
                })
            }
        }
    })
}


module.exports.userLogin=async (req,res)=>{

    const error=[];
    const {email,password}=req.body;
    
        if(!email){
            error.push("Please Provide your email");
        }
        if(email && !validator.isEmail(email)){
            error.push("Please Provide valid Email");
        }
        if(!password){
            error.push("Please Provide your password");
        }
        if(password && password.length<6){
            error.push("Your password must be more than 6 Characters");
        }if(error.length>0){
            res.status(400).json({
                error:{
                    errorMessage:error
                }
            })
        }else{    
            try{
              const user=await registerModel.findOne({
                email:email
              }).select("+password");
              if(user){
                    bcrypt.compare(password, user.password,function(err,result){
                        if(result){
                            const currentUser=createToken(user);
                            res.status(200).cookie("authToken",currentUser.token,currentUser.options).json({
                                successMessage:"Your Login is Successful",
                                token:currentUser.token 
                            });
                        }else{
                            res.status(400).json({
                                error:{
                                    errorMessage:["PLease Provide Valid Password"]
                                },
                            });
                        }
                    });
                }else{
                    res.status(400).json({
                        error:{
                            errorMessage:["Email Doesn't Exist"]
                        },
                    });
                }

            }catch(error){
                res.status(500).json({
                    error:{
                        errorMessage:['Internal Server Error']
                    }
                })
            }
        }
    }

module.exports.userLogout=async(req,res)=>{
    res.status(200).clearCookie('authToken').json({
        successMessage:'Logged out Successfully'
    })
}