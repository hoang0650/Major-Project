const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const roomSchema = new Schema({
    name: {
        type: String
    },
    type: {
        type: String
    }
});

let Room = mongoose.model('room', roomSchema);

module.exports = Room;

