const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const User = new Schema({
    username: {
        type: String,
        required: true
    },
    nick: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    img: {
        type: String, 
        required: true
    },
    friends: {
        type: [String],
        required: false
    },
    posts: {
        type: [String],
        required: false
    }
});


module.exports = mongoose.model('User', User);