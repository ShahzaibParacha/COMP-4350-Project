const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    post_id: {
        type: Number,
        primaryKey: true,
        autoIncrement: true,
    },
    
    user_id: { //the id of the user who posted the post
        type: Number,
        required: true
    },

    content: {
        type: String,
        required: true,
        default: ""
    },

    image: { 
        type: String,
    },

    post_date: { //the date the post was created
        type: Date,
        required: true,
        default: Date.now()
    },

    likes: { //the number of likes
        type: Number,
        required: true,
        default: 0
    },
});
