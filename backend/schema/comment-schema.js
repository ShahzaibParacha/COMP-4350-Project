const mongoose =  require('mongoose')
const Schema = mongoose.Schema

const commentSchema = new Schema({

    post_id: { //the id of the post for the comment
        type: String, // mongoose.ObjectId,
        required: true
    },

    user_id: { //the id of the user who posted the comment
        type: String, // mongoose.ObjectId,
        required: true
    },

    content: {
        type: String,
        required: true,
        default: ""
    },

    comment_date: { //the date the comment was created
        type: Date,
        required: false,
        default: Date.now()
    },
});

module.exports = mongoose.model('Comment', commentSchema);
