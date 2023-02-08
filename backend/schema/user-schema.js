const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username:{
        type: String,
        unique: true,
        minLength: 3,
        maxLength: 30,
    },

    email: {
        type: String,
        unique: true,
        minLength: 3,
        maxLength: 50,
        require: true,
    },

    password: {
        type: String,
        require: true,
        minLength: 8,
        maxLength: 20,
    },

    is_writer: { // ture means writer, false means reader
        type: Boolean,
        require: true,
        default: false,
    },

    registration_date: {
        type: Date,
        default: Date.now(),
        require: false
    },

    last_login_date: {
        type: Date,
        require: false,
    },

    // TODO: create something to store image and video
    profile_photo: {
        type: String,
        require: true,
        default: "a link to default profile photo",
    },

    bio: {
        type: String,
        require: false,
    },

    affiliation: {
        type: String,
        require: false
    }
})

module.exports = mongoose.model('user', userSchema);
