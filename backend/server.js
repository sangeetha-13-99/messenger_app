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
// console.log(__dirname1)
if(process.env.NODE_ENV==='production'){
    app.use(express.static(path.join(__dirname1,"/frontend/build")));
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname1,'frontend','build','index.html'));
    })
}else{
    app.get('/',(req,res)=>{
        console.log(req.path);
        res.send('ok');
    });
}



const PORT=process.env.PORT || 5000;
console.log(process.env.PORT,"PORT")
const dataBaseConnection=require('./config/database');
dataBaseConnection();
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})




