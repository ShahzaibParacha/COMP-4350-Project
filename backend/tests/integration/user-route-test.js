const express = require('express');
const UserSchema = require('../../schema/user-schema');
const SubscriberSchema = require('../../schema/subscriber-schema');
const mongoose = require('mongoose');
const expect = require('chai').expect;
const axios = require('axios');
const Result = require('../../util/ResultCode');
require('dotenv').config();

const cors = require('cors');
const bodyParser = require('body-parser');
const apiRouter = require('../../route/api-route');
const passport = require('passport');
require('../../util/passport')(passport);

let server;
const token = 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MWI0ZjM5MDY5NzIxNjQzNTZiMDUxMyIsImVtYWlsIjoiZGVhbkBlbWFpcXd3bC5jb20iLCJpYXQiOjE2Nzk1MTE5NjZ9.-_SLqEilsyXx6uAmpcbDy_Mgmk-eraPA0pdBpSQzdm0';
let weiyu = {
	_id: null,
	username: 'weiyu',
	password: 'Password123.',
	email: 'weiyu@gmail.com',
	is_writer: false,
};

let tom = {
	_id: null,
	username: 'Tom',
	password: 'Password456.',
	email: 'tom@gmail.com',
	is_writer: false,
	profile_photo: '/sample_profile.jpg'
};

async function resetDatabase() {
	await UserSchema.deleteOne({username: weiyu.username});
	await UserSchema.deleteOne({username: tom.username});

	await UserSchema.create(new UserSchema({
		username: weiyu.username,
		password: weiyu.password,
		email: weiyu.email,
		is_writer: weiyu.is_writer,
		registration_date: Date.now(),
		last_login_date: null,
		bio: null,
		affiliation: null,
		profile_photo: '/sample_profile.jpg'
	}));

	await UserSchema.create(new UserSchema({
		username: tom.username,
		password: tom.password,
		email: tom.email,
		is_writer: tom.is_writer,
		registration_date: Date.now(),
		last_login_date: null,
		bio: null,
		affiliation: null,
		profile_photo: '/sample_profile.jpg'
	}));

	weiyu = await UserSchema.findOne({username: weiyu.username});
	tom = await UserSchema.findOne({username: tom.username});

	await SubscriberSchema.create(new SubscriberSchema({
		creator_id: weiyu._id,
		audience_id: tom._id,
		subscription_date: Date.now(),
		receive_notification: true
	}));
}

describe('User routes', function () {
	before(async () => {
		const app = express();

		mongoose
			.connect(process.env.TEST_MONGODB_CONNECTION, {
				useNewUrlParser: true,
				useUnifiedTopology: true
			});

		app.use(bodyParser.json({extended: true}));
		app.use(bodyParser.urlencoded({extended: true}));
		app.use(cors());

		app.use('/api', apiRouter);

		server = app.listen(process.env.PORT);
	});

	beforeEach(async () => {
		await resetDatabase();
	});

	after(async () => {
		await UserSchema.deleteOne({username: weiyu.username});
		await UserSchema.deleteOne({username: tom.username});

		await mongoose.disconnect();
		server.close();
	});

	describe('Test: POST /user/signup', function () {
		it('should success, all user information valid', async function () {
			const resp = await axios({
				method: 'post',
				data: {
					username: 'Helloworld',
					password: 'aVal1dpassword',
					email: 'helloworld@mail.com',
					is_writer: false
				},
				url: 'http://localhost:4350/api/free/user/signup',
				headers: {
					withCredentials: true
				}
			});

			expect(resp.data.code).to.equal(20000);
			await UserSchema.deleteOne({username: 'Helloworld'});
		});

		it('should fail, user already signup', async function () {
			const resp = await axios({
				method: 'post',
				data: {
					username: weiyu.username,
					password: weiyu.password,
					email: weiyu.email,
					is_writer: weiyu.is_writer
				},
				url: 'http://localhost:4350/api/free/user/signup',
				headers: {
					withCredentials: true
				}
			});

			expect(resp.data.code).to.equal(40004);
		});
	});

	describe('Test: POST /user/login', function () {
		it('should success, username and password correct', async function () {
			const resp = await axios({
				method: 'post',
				data: {
					email: weiyu.email,
					password: weiyu.password
				},
				url: 'http://localhost:4350/api/free/user/login',
				headers: {
					withCredentials: true
				}
			});

			expect(resp.data.code).to.equal(Result.SUCCESS.code);
		});

		it('should fail, username and password not match', async function () {
			const resp = await axios({
				method: 'post',
				data: {
					username: weiyu.username,
					password: 'errorpassWord1'
				},
				url: 'http://localhost:4350/api/free/user/login',
				headers: {
					withCredentials: true
				}
			});

			expect(resp.data.code).to.equal(Result.FAIL.code);
		});
	});

	describe('Test: GET /user/profile', async function () {
		it('should success, userId and Authorization valid', async function () {
			const resp = await axios({
				method: 'get',
				params: {
					user_id: weiyu._id
				},
				url: 'http://localhost:4350/api/user/profile',
				headers: {
					Authorization: token,
					withCredentials: true
				}
			});

			expect(resp.data.data).to.exist;
		});

		it('should fail, userId is invalid', async function () {
			const resp = await axios({
				method: 'get',
				params: {
					user_id: new mongoose.mongo.ObjectID()
				},
				url: 'http://localhost:4350/api/user/profile',
				headers: {
					Authorization: token,
					withCredentials: true
				}
			});

			expect(resp.data.data).to.equal(null);
			expect(resp.data.code).to.equal(Result.FAIL.code);
		});
	});

	describe('Test: POST /user/profile', async function () {
		it('should success, user information valid', async function () {
			const resp = await axios({
				method: 'post',
				data: {
					user_id: weiyu._id,
					bio: 'this is user bio',
					is_writer: true,
					profile_photo: 'a link for profile photo',
					affiliation: 'this is affiliation'
				},
				url: 'http://localhost:4350/api/user/profile',
				headers: {
					Authorization: token,
					withCredentials: true
				}
			});

			expect(resp.data.code).to.equal(Result.SUCCESS.code);
		});

		it('should fail, user id invalid', async function () {
			const resp = await axios({
				method: 'post',
				data: {
					user_id: new mongoose.mongo.ObjectID(),
					bio: 'this is user bio',
					is_writer: true,
					profile_photo: 'a link for profile photo',
					affiliation: 'this is affiliation'
				},
				url: 'http://localhost:4350/api/user/profile',
				headers: {
					Authorization: token,
					withCredentials: true
				}
			});

			expect(resp.data.code).to.equal(Result.UPDATE_FAIL.code);
		});
	});

	describe('Test: GET /user/delete_account', async function () {
		it('should success, the given user_id valid', async () => {
			const resp = await axios({
				method: 'get',
				params: {
					user_id: weiyu._id
				},
				url: 'http://localhost:4350/api/user/deleteAccount',
				headers: {
					Authorization: token,
					withCredentials: true
				}
			});

			expect(resp.data.code).to.equal(Result.SUCCESS.code);
		});

		it('should fail, the given user_id invalid', async () => {
			const resp = await axios({
				method: 'get',
				params: {
					user_id: 'abc'
				},
				url: 'http://localhost:4350/api/user/deleteAccount',
				headers: {
					Authorization: token,
					withCredentials: true
				}
			});

			expect(resp.data.code).to.equal(Result.INVALID_USERID.code);
		});
	});

	describe('Test: POST /user/username', async function () {
		it('should success, user_id and username valid', async function () {
			const resp = await axios({
				method: 'post',
				data: {
					user_id: weiyu._id,
					new_username: 'weiyuSun'
				},
				url: 'http://localhost:4350/api/user/username',
				headers: {
					Authorization: token,
					withCredentials: true
				}
			});

			expect(resp.data.code).to.equal(Result.SUCCESS.code);
			await UserSchema.deleteOne({username: 'weiyuSun'});
		});

		it('should fail, new_username invalid', async function () {
			const resp = await axios({
				method: 'post',
				data: {
					user_id: weiyu._id,
					new_username: 'ab'
				},
				url: 'http://localhost:4350/api/user/username',
				headers: {
					Authorization: token,
					withCredentials: true
				}
			});

			expect(resp.data.code).to.equal(Result.UPDATE_FAIL.code);
		});
	});

	describe('Test: POST /user/password', async function () {
		it('should success, user_id and password valid', async function () {
			const resp = await axios({
				method: 'post',
				data: {
					user_id: weiyu._id,
					new_password: 'this1sValidaaa'
				},
				url: 'http://localhost:4350/api/user/password',
				headers: {
					Authorization: token,
					withCredentials: true
				}
			});

			expect(resp.data.code).to.equal(Result.SUCCESS.code);
		});

		it('should fail, password invalid', async function () {
			const resp = await axios({
				method: 'post',
				data: {
					user_id: weiyu._id,
					new_password: 'invalidpassword'
				},
				url: 'http://localhost:4350/api/user/password',
				headers: {
					Authorization: token,
					withCredentials: true
				}
			});

			expect(resp.data.code).to.equal(Result.FAIL.code);
		});
	});

	describe('Test: POST /user/subscription/followNewUser', async function () {
		it('should success, user_id and creator_id valid', async function () {
			const creatorId = new mongoose.mongo.ObjectID();
			const resp = await axios({
				method: 'post',
				data: {
					user_id: weiyu._id,
					creator_id: creatorId
				},
				url: 'http://localhost:4350/api/user/subscription/followNewUser',
				headers: {
					Authorization: token,
					withCredentials: true
				}
			});

			expect(resp.data.code).to.equal(Result.SUCCESS.code);
			await SubscriberSchema.deleteOne({creator_id: creatorId, audience_id: weiyu._id});
		});

		it('should fail, creator_id invalid', async function () {
			const resp = await axios({
				method: 'post',
				data: {
					user_id: weiyu._id,
					creator_id: 'abc'
				},
				url: 'http://localhost:4350/api/user/subscription/followNewUser',
				headers: {
					Authorization: token,
					withCredentials: true
				}
			});

			expect(resp.data.code).to.equal(Result.INVALID_CREATOR_ID.code);
		});
	});

	describe('Test: GET /user/subscription/getAudience', async function () {
		it('should success, input parameter valid', async function () {
			for (let i = 0; i < 10; i++) {
				await SubscriberSchema.create(new SubscriberSchema({
					creator_id: weiyu._id,
					audience_id: new mongoose.mongo.ObjectID(),
					subscription_date: Date.now(),
					receive_notification: true
				}));
			}

			const resp = await axios({
				method: 'get',
				params: {
					user_id: weiyu._id,
					page_number: 0,
					page_size: 5
				},
				url: 'http://localhost:4350/api/user/subscription/getAudience',
				headers: {
					Authorization: token,
					withCredentials: true
				}
			});

			expect(resp.data.data.length).to.equal(5);
			await SubscriberSchema.deleteMany({creator_id: weiyu._id});
		});

		it('should fail, input parameter valid', async function () {
			const resp = await axios({
				method: 'get',
				params: {
					user_id: weiyu._id + 'abc',
					page_number: 0,
					page_size: 5
				},
				url: 'http://localhost:4350/api/user/subscription/getAudience',
				headers: {
					Authorization: token,
					withCredentials: true
				}
			});

			expect(resp.data.code).to.equal(Result.INVALID_USERID.code);
		});
	});

	describe('Test: GET /user/subscription/getFollowing', async function () {
		it('should success, input parameter valid', async function () {
			for (let i = 0; i < 10; i++) {
				await SubscriberSchema.create(new SubscriberSchema({
					creator_id: new mongoose.mongo.ObjectID(),
					audience_id: weiyu._id,
					subscription_date: Date.now(),
					receive_notification: true
				}));
			}

			const resp = await axios({
				method: 'get',
				params: {
					user_id: weiyu._id,
					page_number: 0,
					page_size: 5
				},
				url: 'http://localhost:4350/api/user/subscription/getFollowing',
				headers: {
					Authorization: token,
					withCredentials: true
				}
			});

			expect(resp.data.data.length).to.equal(5);
			await SubscriberSchema.deleteMany({audience_id: weiyu._id});
		});

		it('should fail, input user_id invalid', async function () {
			for (let i = 0; i < 10; i++) {
				await SubscriberSchema.create(new SubscriberSchema({
					creator_id: new mongoose.mongo.ObjectID(),
					audience_id: weiyu._id,
					subscription_date: Date.now(),
					receive_notification: true
				}));
			}

			const resp = await axios({
				method: 'get',
				params: {
					user_id: weiyu._id + 'abc',
					page_number: 0,
					page_size: 5
				},
				url: 'http://localhost:4350/api/user/subscription/getFollowing',
				headers: {
					Authorization: token,
					withCredentials: true
				}
			});

			expect(resp.data.code).to.equal(Result.INVALID_USERID.code);
		});
	});

	describe('Test: POST /user/subscription/setNotification', async function () {
		it('should success, input parameter valid', async function () {
			const resp = await axios({
				method: 'post',
				data: {
					user_id: tom._id,
					creator_id: weiyu._id,
					set_notification: false
				},
				url: 'http://localhost:4350/api/user/subscription/setNotification',
				headers: {
					Authorization: token,
					withCredentials: true
				}
			});

			expect(resp.data.code).to.equal(Result.SUCCESS.code);
		});

		it('should fail, input parameter invalid', async function () {
			const resp = await axios({
				method: 'post',
				data: {
					user_id: tom._id,
					creator_id: weiyu._id + '123',
					set_notification: false
				},
				url: 'http://localhost:4350/api/user/subscription/setNotification',
				headers: {
					Authorization: token,
					withCredentials: true
				}
			});

			expect(resp.data.code).to.equal(Result.INVALID_CREATOR_ID.code);
		});
	});

	describe('Test: GET /user/subscription/cancel', async function () {
		it('should success, input parameter valid', async function () {
			const resp = await axios({
				method: 'get',
				params: {
					user_id: tom._id,
					creator_id: weiyu._id
				},
				url: 'http://localhost:4350/api/user/subscription/cancel',
				headers: {
					Authorization: token,
					withCredentials: true
				}
			});

			expect(resp.data.code).to.equal(Result.SUCCESS.code);
		});

		it('should fail, input parameter valid', async function () {
			const resp = await axios({
				method: 'get',
				params: {
					user_id: tom._id,
					creator_id: new mongoose.mongo.ObjectID()
				},
				url: 'http://localhost:4350/api/user/subscription/cancel',
				headers: {
					Authorization: token,
					withCredentials: true
				}
			});

			expect(resp.data.code).to.equal(Result.NOT_SUBSCRIBE.code);
		});
	});

	describe('Test: GET /user/subscription/isSubscribed', async function () {
		it('should success, input parameter valid', async function () {
			const resp = await axios({
				method: 'get',
				params: {
					user_id: tom._id,
					creator_id: weiyu._id
				},
				url: 'http://localhost:4350/api/user/subscription/isSubscribed',
				headers: {
					Authorization: token,
					withCredentials: true
				}
			});

			expect(resp.data.code).to.equal(Result.SUCCESS.code);
		});

		it('should success, input parameter valid', async function () {
			const resp = await axios({
				method: 'get',
				params: {
					user_id: tom._id,
					creator_id: new mongoose.mongo.ObjectID()
				},
				url: 'http://localhost:4350/api/user/subscription/isSubscribed',
				headers: {
					Authorization: token,
					withCredentials: true
				}
			});

			expect(resp.data.code).to.equal(Result.SUCCESS.code);
		});

		it('should fail, input parameter invalid', async function () {
			const resp = await axios({
				method: 'get',
				params: {
					user_id: tom._id + '123',
					creator_id: new mongoose.mongo.ObjectID()
				},
				url: 'http://localhost:4350/api/user/subscription/isSubscribed',
				headers: {
					Authorization: token,
					withCredentials: true
				}
			});

			expect(resp.data.code).to.equal(Result.INVALID_USERID.code);
		});
	});

	describe('Test: GET /user/subscription/getSubscription', async function () {
		it('should success, input parameter valid', async function () {
			const resp = await axios({
				method: 'get',
				params: {
					user_id: tom._id,
					creator_id: weiyu._id
				},
				url: 'http://localhost:4350/api/user/subscription/getSubscription',
				headers: {
					Authorization: token,
					withCredentials: true
				}
			});

			expect(resp.data.data).to.not.equal(null);
		});

		it('should success, input parameter valid', async function () {
			const resp = await axios({
				method: 'get',
				params: {
					user_id: tom._id,
					creator_id: new mongoose.mongo.ObjectID()
				},
				url: 'http://localhost:4350/api/user/subscription/getSubscription',
				headers: {
					Authorization: token,
					withCredentials: true
				}
			});

			expect(resp.data.code).to.equal(Result.SUCCESS.code);
			expect(resp.data.data).to.equal(null);
		});

		it('should fail, input parameter invalid', async function () {
			const resp = await axios({
				method: 'get',
				params: {
					user_id: tom._id + '12',
					creator_id: new mongoose.mongo.ObjectID()
				},
				url: 'http://localhost:4350/api/user/subscription/getSubscription',
				headers: {
					Authorization: token,
					withCredentials: true
				}
			});

			expect(resp.data.code).to.equal(Result.INVALID_USERID.code);
		});
	});
});
