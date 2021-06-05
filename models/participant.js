const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const participantSchema = new Schema({
    roomID: {
        type: String
    },
    userID: {
        type: String
    }
});

let Parti = mongoose.model('participant', participantSchema);

module.exports = Parti;

