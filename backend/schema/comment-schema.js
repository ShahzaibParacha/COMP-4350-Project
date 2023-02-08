const mongoose =  require('mongoose')
const Schema = mongoose.Schema

const commentSchema = new Schema({

    post_id: { //the id of the post for the comment
        type: mongoose.ObjectId,
        required: [true, "The id of the post this comment attached needs to be provided."],
    },

    user_id: { //the id of the user who posted the comment
        type: mongoose.ObjectId,
        required: [true, "The user_id who made this comment needs to be provided."],
    },

    content: { //the comment cotent
        type: String,
        required: [true, "The comment content needs to be provided."],
        default: ' ',
    },

    comment_date: { //the date the comment was created
        type: Date,
        required: [true, "The creation date for this comment needs to be provided."],
        default: Date.now(),
    },
});

module.exports = mongoose.model('Comment', commentSchema);
