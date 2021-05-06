const router = require('express').Router();
const Pusher = require('pusher');
const dotenv = require('dotenv');
dotenv.config();

const pusher = new Pusher({
    appId:process.env.PUSHER_APP_ID ,
    key:process.env.PUSHER_APP_KEY ,
    secret: process.env.PUSHER_APP_SECRET,
    cluster:process.env.PUSHER_APP_CLUSTER ,
    useTLS: true
  });
router.post('/',(req,res)=>{
    req.session.username=req.body.username;
    res.json('Joined');
});
router.post('/pusher/auth',(req,res)=>{
    const socketId = req.body.socket_id;
    const channel = req.body.channel_name;
    const presenceData ={
        user_id: req.session.username
    };
    const auth = pusher.authenticate(socketId,channel,presenceData);
    res.send(auth);
});
router.post('/send-message',(req,res)=>{
    pusher.trigger('THT-chatApp','message-sent',{
        username: req.body.username,
        message: req.body.message
    });
    res.send('Message sent');
});
module.exports = router;