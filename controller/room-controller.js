const Room = require('../models/room');
const Parti = require('../models/participant');
const User = require('../models/user');

//Get All Message
const getRoom = async (req, res) => {
    try {
        const { roomID } = req.body;

        if (!roomID)
            return res
                .status(400)
                .json('Please enter all require fields.');

        const existingRoom = await Room.find({ _id: roomID });

        if (!existingRoom)
            return res.status(400).json('No room exists.');


        return res.json(existingRoom);

    } catch (error) {
        return res.status(500).json({ msg: err.message });
    }
};

const createRoom = async (req, res) => {
    try {
        const { userEmail, currentUserName, currentUserID } = req.body;
        if (!userEmail || !currentUserName || !currentUserID)
            return res
                .status(400)
                .json('Please enter all require fields.');

        //get user info
        const existingUser = await User.findOne({ email: userEmail });
        if (!existingUser)
            return res.status(400).json('An account with this email not exists.');


        var userName = existingUser.userName; 
        var userID = existingUser._id;

        var newRoomID;
        var room = new Room();
        room.name = userName + " and " + currentUserName;
        room.type = "private";
        await room.save().then(function (room) {
            newRoomID = room._id;
        }).catch(function (err) {
            return false;
        });

        if (!newRoomID) {
            console.log(newRoomID);
            return res
                .status(400)
                .json('Can not create rooms.');
        }

        console.log(newRoomID);

        var userParti = new Parti();
        userParti.roomID = newRoomID;
        userParti.userID = userID;
        try {
            await userParti.save();
        }
        catch (error) {
            console.log(error);
        }

        var userCurrentParti = new Parti();
        userCurrentParti.roomID = newRoomID;
        userCurrentParti.userID = currentUserID;
        try {
            await userCurrentParti.save();
        }
        catch (error) {
            console.log(error);
        }

        return res.status(201).json("create room success!");
    } catch (error) {
        return res.status(500).json({ msg: err.message });
    }
};

const updateRoom = async (req, res) => {
    try {
        return res.json("update room work!")

    } catch (error) {
        return res.status(500).json({ msg: err.message });
    }
};


const deleteRoom = async (req, res) => {
    try {
        return res.json("delete room work!")

    } catch (error) {
        return res.status(500).json({ msg: err.message });
    }
};

module.exports = { getRoom, createRoom, updateRoom, deleteRoom };


