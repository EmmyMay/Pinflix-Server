const mongoose = require('mongoose');


const TwitterSchema = new mongoose.Schema({
    caption: {

        type: String,
        required: true
    },
    handle: {
        type: String,
        required: true
    },
    firsthref: {
        type: String,
        required: true
    },
    secondhref: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    uploadDate: {
        type: Date,
        default: Date.now()
    }
});



const tweetpin = mongoose.model('tweets', TwitterSchema);

module.exports = tweetpin;