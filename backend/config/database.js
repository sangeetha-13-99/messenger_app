const mongoose=require('mongoose');

const DB=process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD)

const dataBaseConnection=()=>{
    mongoose.connect(DB,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    }).then(()=>{
        console.log("mongodb database connected")
    }).catch((error)=>{
        console.log(error)
    })
}

module.exports = dataBaseConnection;