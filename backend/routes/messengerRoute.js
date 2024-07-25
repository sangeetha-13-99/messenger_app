const router = require('express').Router();

const {getFriends,sendMessage,getMessage,seenMessage}=require('../controller/messengerController');
const {authMiddleware}= require('../middleware/authMiddleware');

router.get('/get-friends',authMiddleware,getFriends);
router.post('/send-message',authMiddleware,sendMessage);
router.get('/get-message/:id',authMiddleware,getMessage);
router.post('/seen-message',authMiddleware,seenMessage);



module.exports=router;