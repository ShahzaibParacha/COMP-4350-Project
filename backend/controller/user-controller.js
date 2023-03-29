const userService = require('../service/user-service');
const subscriberService = require('../service/subscriber-service');
const Result = require('../util/Result');

function login (req, res) {
	const { email, password } = req.body;
	userService.getJwt(email, password)
		.then((result) => {
			if (result === null) {
				res.json(Result.fail('User or Password do not correct'));
			} else {
				res.json(Result.success(result));
			}
		});
}

function signup (req, res) {
	const { username, email, password } = req.body;
	const isWriter = req.body.is_writer;
	userService.signup({ email, password, username, isWriter })
		.then((result) => {
			if (result) {
				res.json(Result.success(null));
			} else {
				res.json(Result.failSignup());
			}
		});
}

function getUserProfile (req, res) {
	const id = req.query.user_id;
	userService.getUserInfo(id).then((user) => {
		if (user) {
			res.json(Result.success(user));
		} else {
			res.json(Result.fail('Cannot find user by given user_id'));
		}
	});
}

function updateUserProfile (req, res) {
	const id = req.body.user_id;
	const profilePhoto = req.body.profile_photo;
	const isWriter = req.body.is_writer;
	const { affiliation, bio } = req.body;

	userService.updateUserInfo({ id, profilePhoto, isWriter, affiliation, bio }).then((result) => {
		(result === true) ? res.json(Result.success(null)) : res.json(Result.failUpdate());
	});
}

function removeAccount (req, res) {
	const id = req.query.user_id;

	userService.removeUser(id).then((result) => {
		/* istanbul ignore else */
		if (result === true) {
			res.json(Result.success(null));
		} else {
			res.json(Result.fail('Cannot remove user by given user_id, or the user_id doesn\'t exist'));
		}
	});
}

function updateUsername (req, res) {
	const id = req.body.user_id;

	const newUsername = req.body.new_username;

	userService.updateUsername({ id, newUsername }).then(result => {
		if (result === true) {
			res.json(Result.success(null));
		} else {
			res.json(Result.failUpdate());
		}
	});
}

function updatePassword (req, res) {
	const id = req.body.user_id;
	const newPassword = req.body.new_password;

	userService.updatePassword({ id, newPassword }).then(result => {
		if (result === true) {
			res.json(Result.success(null));
		} else {
			res.json(Result.fail('Fail to update password by given user_id'));
		}
	});
}

function subscribeUser (req, res) {
	subscriberService.subscribeCreator(req.body.creator_id, req.body.user_id).then(result => {
		/* istanbul ignore else */
		if (result === true) {
			res.json(Result.success(null));
		} else {
			res.json(Result.fail('Fail to subscribe'));
		}
	});
}

function getMyFollowing (req, res) {
	const pageNum = parseInt(req.query.page_number);
	const pageSize = parseInt(req.query.page_size);
	subscriberService.getUserFollowingPage(req.query.user_id, pageNum, pageSize).then(result => {
		/* istanbul ignore else */
		if (result) {
			const promises = [];
			const output = [];

			for (const item of result) {
				promises.push(userService.getUserInfo(item.creator_id));
			}

			// get important subscription information as well as the username
			// and profile photo of the user I am subscribed to
			Promise.all(promises).then((data) => {
				for (let i = 0; i < result.length; i++) {
					output.push({username: data[i].username, 
						profile_photo: data[i].profile_photo,
						creator_id: result[i].creator_id,
					receive_notification: result[i].receive_notification});
				}

				res.json(Result.success(output));
			}).
			catch((err) => {
				res.json(Result.fail([]));
			})
		} else {
			res.json('Cannot find following list');
		}
	});
}

function getMyAudience (req, res) {
	const pageNum = parseInt(req.query.page_number);
	const pageSize = parseInt(req.query.page_size);
	subscriberService.getUserAudiences(req.query.user_id, pageNum, pageSize).then(result => {
		/* istanbul ignore else */
		if (result) {
			res.json(Result.success(result));
		} else {
			res.json(Result.fail('Cannot get audience list'));
		}
	});
}

function cancelSubscription (req, res) {
	subscriberService.cancelSubscription(req.query.creator_id, req.query.user_id).then(result => {
		/* istanbul ignore else */
		if (result === true) {
			res.json(Result.success(null));
		} else {
			res.json(Result.fail('Fail to cancel subscription'));
		}
	});
}

function setNotification (req, res) {
	subscriberService.turnOnOrOffNotification(req.body.creator_id, req.body.user_id, req.body.set_notification).then(result => {
		/* istanbul ignore else */
		if (result === true) {
			res.json(Result.success(null));
		} else {
			res.json(Result.fail('Fail to update notification'));
		}
	});
}

function isSubscribed (req, res) {
	subscriberService.isSubscribed(req.query.creator_id, req.query.user_id).then(result => {
		res.json(Result.success(result));
	});
}

function getSubscription (req, res) {
	subscriberService.getSubscription(req.query.creator_id, req.query.user_id).then(result => {
		res.json(Result.success(result));
	});
}

exports.login = login;
exports.signup = signup;
exports.getUserProfile = getUserProfile;
exports.updateUserProfile = updateUserProfile;
exports.removeAccount = removeAccount;
exports.updateUsername = updateUsername;
exports.updatePassword = updatePassword;
exports.subscribeUser = subscribeUser;
exports.getMyFollowing = getMyFollowing;
exports.getMyAudience = getMyAudience;
exports.cancelSubscription = cancelSubscription;
exports.setNotification = setNotification;
exports.isSubscribed = isSubscribed;
exports.getSubscription = getSubscription;
