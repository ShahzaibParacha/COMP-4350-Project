const mongoose = require('mongoose');
const userModel = require('../model/user-model');

function isValidObjectId (id) {
	return mongoose.Types.ObjectId.isValid(id);
}

function isValidUsername (username) {
	return typeof username === 'string' && username.length >= 3 && username.length <= 30;
}

function isValidPassword (password) {
	if (!(typeof password === 'string' && password.length >= 8 && password.length <= 20)) return false;

	const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=\S+$).{3,}$/;
	return re.test(password);
}

function isValidEmail (email) {
	if (!(typeof email === 'string' && email.length >= 8 && email.length <= 50)) { return false; }

	const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
	return validRegex.test(email);
}

async function isRegisteredUserId (id) {
	const result = await userModel.getUserById(id);
	return result !== undefined && result !== null;
}

exports.isValidObjectId = isValidObjectId;
exports.isValidUsername = isValidUsername;
exports.isValidPassword = isValidPassword;
exports.isValidEmail = isValidEmail;
exports.isRegisteredUserId = isRegisteredUserId;
