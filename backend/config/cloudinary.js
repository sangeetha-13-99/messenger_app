const cloudinary=require('cloudinary');

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_APIKEY, 
    api_secret: process.env.CLOUD_SECRETKEY 
});

module.exports=cloudinary;