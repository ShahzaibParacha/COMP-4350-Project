const mongoose = require('mongoose');
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
		required: true
	},

	email: {
		type: String,
		unique: true,
		minLength: 5,
		maxLength: 50,
		validate: (email) => {
			return email.length >= 5 && email.length <= 50;
		},
		required: true
	},

	password: {
		type: String,
		required: true,
		minLength: 8,
		maxLength: 20,
		validate: (password) => {
			return password.length >= 8 && password.length <= 20;
		}
	},

	is_writer: { // true means writer, false means reader
		type: Boolean,
		required: true,
		default: false
	},

	registration_date: {
		type: Date,
		default: Date.now(),
		required: false
	},

	last_login_date: {
		type: Date,
		required: false,
		default: null
	},

	// TODO: create something to store image and video
	profile_photo: {
		type: String,
		required: true,
		default: 'a link to default profile photo'
	},

	bio: {
		type: String,
		required: false,
		default: ''
	},

	affiliation: {
		type: String,
		required: false,
		default: ''
	}
});

module.exports = mongoose.model('User', userSchema);
