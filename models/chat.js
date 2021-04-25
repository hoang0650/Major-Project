const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const chatSchema = new Schema({
    sender: {
        type: String
    },
    message: {
        type: String
    },
    // avatar: {
    //     type: String,
    //     required: true
    // }
},{
    timestamps: true
});

let Chat = mongoose.model('Chats', chatSchema);

module.exports = Chat;