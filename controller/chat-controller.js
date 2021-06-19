const Chat = require('../models/chat');

//Get All Message
const getMsg = async(req,res)=>{
    try {
        const {userID, roomID}=req.body;

        if(!roomID || !userID)
            return res
                .status(400)
                .json('Please enter all require fields.');

        const chats = await Chat.find({userID:userID, roomID:roomID});
        res.json({chats});
    } catch (error) {
        return res.status(500).json({msg: err.message});
    }
};

//Send Message
const sendMsg = async (req,res)=>{
    try {
        const {sender,message} = req.body;
        const newChat = new Chat({sender,message});
        await newChat.save();
        res.json('Message sent');
    } catch (error) {
        return res.status(500).json({msg: err.message});
    }
};

//Delete Message
const deleteMsg = async (req,res)=>{
    try {
        await Chat.findByIdAndDelete(req.params.id);
        res.json('Message was deleted');
    } catch (error) {
        return res.status(500).json({msg: err.message});
    }
};

//Update Message
const updateMsg = async (req,res)=>{
    try {
        const message = req.body;
        await Chat.findOneAndUpdate({_id: req.params.id},message);
            res.json({msg:'Message was updated'});
        
    } catch (error) {
        return res.status(500).json({msg: err.message});
    }
}

module.exports = {getMsg,sendMsg,deleteMsg,updateMsg};