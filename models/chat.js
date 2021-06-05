const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const chatSchema = new Schema({
    roomID: {
        type: String
    },
    userID: {
        type: String
    },
    message: {
        type: String  
    },
},{
    timestamps: true
});

let Chat = mongoose.model('Chats', chatSchema);

module.exports = Chat;