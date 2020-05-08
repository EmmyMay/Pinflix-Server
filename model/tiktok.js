const mongoose = require('mongoose');

const TiktokSchema = new mongoose.Schema({
    cite: {

        type: String,
        required: true
    },
    vidID: {
        type: String,
        required: true
    },

    uploadDate: {
        type: Date,
        default: Date.now()
    }
});
const tiktokpin = mongoose.model("tiks", TiktokSchema);

module.exports = tiktokpin;