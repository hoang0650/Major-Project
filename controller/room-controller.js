const Room = require('../models/room');

//Get All Message
const getRoom = async(req,res)=>{
    try {
        const {roomID}=req.body;

        if(!roomID)
            return res
                .status(400)
                .json('Please enter all require fields.');
        
        const existingRoom = await Room.find({_id:roomID});

        if(!existingRoom)
            return res.status(400).json('No room exists.');


        return res.json(existingRoom);

    } catch (error) {
        return res.status(500).json({msg: err.message});
    }
};

const createRoom = async(req,res)=>{
    try {
        return res.json("create room work!")
    } catch (error) {
        return res.status(500).json({msg: err.message});
    }
};

const updateRoom = async(req,res)=>{
    try {
        return res.json("update room work!")
        
    } catch (error) {
        return res.status(500).json({msg: err.message});
    }
};


const deleteRoom = async(req,res)=>{
    try {
        return res.json("delete room work!")
        
    } catch (error) {
        return res.status(500).json({msg: err.message});
    }
};

module.exports = {getRoom,createRoom,updateRoom,deleteRoom};


