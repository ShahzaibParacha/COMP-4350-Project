const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const likesSchema = new Schema({

	post_id: { // the id of the post that was liked
		type: mongoose.ObjectId,
		required: true
	},

	user_id: { // the id of the user who liked the post
		type: mongoose.ObjectId,
		required: true
	},

	liked_date: { // the date the like event happened
		type: Date,
		required: true,
		default: Date.now()
	}
});

//index the columns to make search faster
likesSchema.index({post_id: 1, user_id: 1});

module.exports = mongoose.model('Like', likesSchema);
