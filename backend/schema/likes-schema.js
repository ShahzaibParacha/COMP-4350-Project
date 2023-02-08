const mongoose =  require('mongoose')
const Schema = mongoose.Schema

const likesSchema = new Schema({

    post_id: { //the id of the post that was liked
        type: mongoose.ObjectId,
        required: true,
    },

    user_id: { //the id of the user who liked the post
        type: mongoose.ObjectId,
        required: true,
    },
});

module.exports = mongoose.model('Like', likesSchema);
