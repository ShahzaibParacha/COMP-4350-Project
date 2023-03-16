const User = require('../schema/user-schema');
const ParamValidation = require('../util/ParamValidationUtil');

async function createNewUser(userInfo) {
	if (!ParamValidation.isValidUsername(userInfo.username) || !ParamValidation.isValidPassword(userInfo.password)
		|| !ParamValidation.isValidEmail(userInfo.email))
		return false;

	if (await getUserByEmail(userInfo.email)) {
		return false;
	}

	if (await getUserByUsername(userInfo.username)) {
		return false;
	}
	// username, email, password, birthday, is_writer, registration_date, last_login_date, bio,affiliation
	const user = new User({
		username: userInfo.username,
		password: userInfo.password,
		email: userInfo.email,
		is_writer: userInfo.isWriter,
		registration_date: Date.now(),
		last_login_date: null,
		bio: null,
		affiliation: null,
		profile_photo: '/sample_profile.jpg'
	});

	let result = await User.create(user);
	return result !== null;
}

async function getUserById(id) {
	if (!ParamValidation.isValidObjectId(id)) return null;
	return await User.findOne({_id: id});
}

async function getUserByUsername(username) {
	return await User.findOne({username});
}

async function getUserByEmail(email) {
	return await User.findOne({email});
}

async function updateUsername({id, newUsername}) {
	if (!ParamValidation.isValidObjectId(id)) return false;
	if (!ParamValidation.isValidUsername(newUsername)) return false;

	if (await getUserByUsername(newUsername) !== null) { // means the username have already, the user cannot use this
		return false;
	}

	const result = await User.updateOne({_id: id}, {username: newUsername});
	return result.ok === 1;
}

async function updateBasicInfo({id, isWriter, profilePhoto, bio, affiliation}) {
	if (!ParamValidation.isValidObjectId(id)) {
		return false;
	}

	const user = await getUserById(id);

	if (user === undefined || user === null) {
		return false;
	}

	if (profilePhoto === undefined || profilePhoto === null) {
		profilePhoto = user.profile_photo;
	}

	if (isWriter === undefined || isWriter == null) {
		isWriter = user.is_writer;
	}

	if (affiliation === undefined || affiliation === null) {
		affiliation = user.affiliation;
	}

	if (bio === undefined || bio === null) {
		bio = user.bio;
	}

	const result = await User.updateOne({_id: id}, {
		is_writer: isWriter,
		profile_photo: profilePhoto,
		bio,
		affiliation
	});

	return result.ok === 1;
}

async function updatePassword({id, newPassword}) {
	if (!ParamValidation.isValidPassword(newPassword)) return false;
	if (!ParamValidation.isValidObjectId(id)) return false;

	const result = await User.updateOne({_id: id}, {password: newPassword});
	return result.ok === 1;
}

async function removeUser(id) {
	if (!ParamValidation.isValidObjectId(id)) return false;
	const result = await User.remove({_id: id});
	return result.ok === 1;
}

exports.getUserById = getUserById;
exports.createNewUser = createNewUser;
exports.getUserByEmail = getUserByEmail;
exports.getUserByUsername = getUserByUsername;
exports.updateUsername = updateUsername;
exports.updatePassword = updatePassword;
exports.updateBasicInfo = updateBasicInfo;
exports.removeUser = removeUser;
