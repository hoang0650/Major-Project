const Parti = require('../models/participant');

//Get All Message
const getParticipant = async(req,res)=>{
    try {
        const {userID}=req.body;

        if(!userID)
            return res
                .status(400)
                .json('Please enter all require fields.');
        
        const existingParti = await Parti.find({userID});
        if(!existingParti)
            return res.status(400).json('No participant exists.');


        return res.json(existingParti);

    } catch (error) {
        return res.status(500).json({msg: err.message});
    }
};

const createParticipant = async(req,res)=>{
    try {
        return res.json("create Parti work!")
    } catch (error) {
        return res.status(500).json({msg: err.message});
    }
};

const updateParticipant = async(req,res)=>{
    try {
        return res.json("update Parti work!")
        
    } catch (error) {
        return res.status(500).json({msg: err.message});
    }
};


const deleteParticipant = async(req,res)=>{
    try {
        return res.json("delete Parti work!")
    } catch (error) {
        return res.status(500).json({msg: err.message});
    }
};


module.exports = {getParticipant,createParticipant,updateParticipant,deleteParticipant};


