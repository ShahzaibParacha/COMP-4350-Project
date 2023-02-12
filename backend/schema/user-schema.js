const mongoose = require('mongoose')
const {each} = require("mongoose/lib/utils");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        minLength: 3,
        maxLength: 30,
        validate: (username) => {
            return username.length >= 3 && username.length <= 30;
        },
        require: true
    },

    email: {
        type: String,
        unique: true,
        minLength: 5,
        maxLength: 50,
        validate: (email) => {
            return email.length >= 5 && email.length <= 50;
        },
        require: true,
    },

    password: {
        type: String,
        require: true,
        minLength: 8,
        maxLength: 20,
        validate: (password) => {
            return password.length >= 8 && password.length <= 20;
        },
    },

    is_writer: { // true means writer, false means reader
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
        default: null
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
        default: ""
    },

    affiliation: {
        type: String,
        require: false,
        default: ""
    }
})

module.exports = mongoose.model('User', userSchema);
