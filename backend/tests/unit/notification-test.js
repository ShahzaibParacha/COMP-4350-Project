const SubscriberSchema = require('../../schema/subscriber-schema');
const mongoose = require('mongoose');
const SubscriberService = require('../../service/subscriber-service');
const sinon = require('sinon');
const User = require('../../schema/user-schema');
const expect = require('chai').expect;
require('dotenv').config();

let userList = [];
const post_id = new mongoose.mongo.ObjectID();

function resetUserList () {
	userList = [];
	let userIDs = [];

	for (let i = 0; i < 4; i++) {
		userIDs.push(new mongoose.mongo.ObjectID());
	}

	userList.push({
		_id: userIDs[0].toString(),
		username: 'Qiqiang Gao',
		email: 'qiqiang@qq.com',
		password: 'wojiaoqiqiang',
		is_writer: true,
		profile_photo: 'default',
		bio: '',
		affiliation: ''
	});
	userList.push({
		_id: userIDs[1].toString(),
		username: 'Xin An',
		email: 'anxin@qq.com',
		password: 'abcabc',
		is_writer: false,
		profile_photo: 'default',
		bio: '',
		affiliation: ''
	});
	userList.push({
		_id: userIDs[2].toString(),
		username: 'Jiang Xu',
		email: 'jiang@shenmedangci.com',
		password: 'shiwoxiaojiang',
		is_writer: false,
		profile_photo: 'default',
		bio: '',
		affiliation: ''
	});
	userList.push({
		_id: userIDs[3].toString(),
		username: 'Youtian Li',
		email: 'youtian@mang.com',
		password: 'youtianxiashan',
		is_writer: false,
		profile_photo: 'default',
		bio: '',
		affiliation: ''
	});
}

function setFakeDatabase () {
	sinon.stub(User, 'findOne').callsFake((param) => {
		if (param.hasOwnProperty('username')) {
			const a = userList.find(user => user.username === param.username);
			if (a === undefined) {
				return null;
			}
			return a;
		} else if (param.hasOwnProperty('email')) {
			return userList.find(user => user.email === param.email);
		} else if (param.hasOwnProperty('_id')) {
			return userList.find(user => user._id === param._id);
		}
		return null;
	});

	sinon.stub(User, 'updateOne').callsFake((condition, update) => {
		if (condition._id === undefined || condition._id === null) { return { ok: 0 }; }

		const user = userList.find(user => user._id === condition._id);

		if (user) {
			if (update.hasOwnProperty('username')) {
				user.username = update.username;
			} else if (update.hasOwnProperty('password')) {
				user.password = update.password;
			} else {
				// isWriter, profilePhoto, bio, affiliation
				user.is_writer = update.isWriter;
				user.profile_photo = update.profilePhoto;
				user.bio = update.bio;
				user.affiliation = update.affiliation;
			}

			return { ok: 1 };
		}

		return { ok: 0 };
	});

	sinon.stub(User, 'create').callsFake(() => {
		userList.push();
		return true;
	});

	sinon.stub(User, 'remove').callsFake((param) => {
		userList = userList.filter(user => user._id !== param._id);
		return { ok: 1 };
	});

	// setup subscribes
	SubscriberSchema.deleteMany({ creator_id: userList[0]._id });
	SubscriberSchema.deleteMany({ audience_id: userList[0]._id });

	SubscriberSchema.create(new SubscriberSchema({
		creator_id: userList[0]._id,
		audience_id: userList[1]._id,
		subscription_date: Date.now(),
		receive_notification: true
	}));

	SubscriberSchema.create(new SubscriberSchema({
		creator_id: userList[0]._id,
		audience_id: userList[2]._id,
		subscription_date: Date.now(),
		receive_notification: false
	}));

	SubscriberSchema.create(new SubscriberSchema({
		creator_id: userList[0]._id,
		audience_id: userList[3]._id,
		subscription_date: Date.now(),
		receive_notification: true
	}));

	SubscriberSchema.create(new SubscriberSchema({
		creator_id: userList[1]._id,
		audience_id: userList[0]._id,
		subscription_date: Date.now(),
		receive_notification: true
	}));
}

async function connectDatabase () {
	mongoose
		.connect(process.env.MONGODB_CONNECTION, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});
}

describe('Subscriber notification tests', function () {
	before(async () => {
		await connectDatabase();
	});

	beforeEach(() => {
		resetUserList();
		setFakeDatabase();
	});

	afterEach(() => {
		sinon.restore();
	});

	after(async () => {
		await SubscriberSchema.deleteMany({ creator_id: userList[0]._id });
		await SubscriberSchema.deleteMany({ audience_id: userList[0]._id });
		await mongoose.disconnect();
	});

	describe('Test notify audiences', function () {
		const content = 'This is a test email notification to subscribers';

		it('should send email notification to subscribers successfully', async () => {
			const result = await SubscriberService.notifyAudiences(userList[0]._id, post_id, content);
			expect(result.notification_state).to.equal('success');
			expect(result.notification_accepted_by).to.deep.equal([userList[1].email, userList[3].email]);
		});

		it('should not send anything because there are no subscribers for the creator.', async () => {
			const result = await SubscriberService.notifyAudiences(userList[2]._id, post_id, content);
			expect(result.notification_state).to.equal('success');
			expect(result.notification_accepted_by).to.deep.equal([]);
		});

		it('should not send anything because the creator id does not exist.', async () => {
			const result = await SubscriberService.notifyAudiences(new mongoose.mongo.ObjectID(), post_id, content);
			expect(result.notification_accepted_by).to.deep.equal([]);
		});
	});
});
