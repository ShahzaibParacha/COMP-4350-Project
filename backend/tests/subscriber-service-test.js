const SubscriberSchema = require('../schema/subscriber-schema');
const mongoose = require('mongoose');
const Subscriber = require('../schema/subscriber-schema');
const SubscriberService = require('../service/subscriber-service');
const expect = require('chai').expect;
require('dotenv').config();

const creatorID = new mongoose.mongo.ObjectID();
const audienceID = new mongoose.mongo.ObjectID();

async function resetDatabase () {
	await SubscriberSchema.deleteMany({ creator_id: creatorID });
	await SubscriberSchema.deleteMany({ audience_id: audienceID });

	for (let i = 0; i < 10; i++) {
		await SubscriberSchema.create(new Subscriber({
			creator_id: creatorID,
			audience_id: new mongoose.mongo.ObjectID(),
			subscription_date: Date.now(),
			receive_notification: true
		}));

		await SubscriberSchema.create(new Subscriber({
			creator_id: new mongoose.mongo.ObjectID(),
			audience_id: audienceID,
			subscription_date: Date.now(),
			receive_notification: true
		}));
	}

	await SubscriberSchema.create(new Subscriber({
		creator_id: creatorID,
		audience_id: audienceID,
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

describe('Subscriber services and model', function () {
	before(async () => {
		await connectDatabase();
	});

	beforeEach(async () => {
		await resetDatabase();
	});

	after(async () => {
		await SubscriberSchema.deleteMany({ creator_id: creatorID });
		await SubscriberSchema.deleteMany({ audience_id: audienceID });
		await mongoose.disconnect();
	});

	describe('Test get user audiences', function () {
		it('should return 5', async function () {
			const result = await SubscriberService.getUserAudiences(creatorID, 0, 5);
			expect(result.length).to.equal(5);
		});
		it('should return 11', async function () {
			const result = await SubscriberService.getUserAudiences(creatorID);
			expect(result.length).to.equal(11);
		});
		it('should return nothing', async function () {
			const result = await SubscriberService.getUserAudiences(new mongoose.mongo.ObjectID());
			expect(result.length).to.equal(0);
		});
	});

	describe('Test get user following', function () {
		it('should return 5', async function () {
			const result = await SubscriberService.getUserFollowingPage(audienceID, 0, 5);
			expect(result.length).to.equal(5);
		});

		it('should return nothing', async function () {
			const result = await SubscriberService.getUserFollowingPage('abc', 0, 5);
			expect(result).to.equal(null);
		});
	});

	describe('Test notification setting', function () {
		it('should return true', async function () {
			const result = await SubscriberService.turnOnOrOffNotification(creatorID, audienceID, false);
			expect(result).to.equal(true);
		});

		it('should return false', async function () {
			const result = await SubscriberService.turnOnOrOffNotification('abc', audienceID, false);
			expect(result).to.equal(false);
		});

		it('should return false', async function () {
			const result = await SubscriberService.turnOnOrOffNotification(creatorID, 'abc', false);
			expect(result).to.equal(false);
		});
	});

	describe('Test subscribe creator', function () {
		it('should return true', async function () {
			const result = await SubscriberService.subscribeCreator(new mongoose.mongo.ObjectID(), new mongoose.mongo.ObjectID());
			expect(result).to.equal(true);
		});

		it('should return false', async function () {
			const result = await SubscriberService.subscribeCreator(new mongoose.mongo.ObjectID(), 'abc');
			expect(result).to.equal(false);
		});

		it('should return false', async function () {
			const result = await SubscriberService.subscribeCreator('abc', new mongoose.mongo.ObjectID());
			expect(result).to.equal(false);
		});
	});

	describe('Test cancel subscription', function () {
		it('should return true', async function () {
			const result = await SubscriberService.cancelSubscription(creatorID, audienceID);
			expect(result).to.equal(true);
		});

		it('should return false', async function () {
			const result = await SubscriberService.cancelSubscription(new mongoose.mongo.ObjectID(), 'abc');
			expect(result).to.equal(false);
		});

		it('should return false', async function () {
			const result = await SubscriberService.cancelSubscription('abc', new mongoose.mongo.ObjectID());
			expect(result).to.equal(false);
		});
	});

	describe('Test isSubscribed', function () {
		it('should return true', async function () {
			const result = await SubscriberService.isSubscribed(creatorID, audienceID);
			expect(result).to.equal(true);
		});

		it('should return false', async function () {
			const result = await SubscriberService.isSubscribed(creatorID, new mongoose.mongo.ObjectID());
			expect(result).to.equal(false);
		});

		it('should return false', async function () {
			const result = await SubscriberService.isSubscribed(creatorID, 'abc');
			expect(result).to.equal(false);
		});

		it('should return false', async function () {
			const result = await SubscriberService.isSubscribed('abc', audienceID);
			expect(result).to.equal(false);
		});
	});

	describe('Test get subscription', function () {
		it('should return subscription', async function () {
			const result = await SubscriberService.getSubscription(creatorID, audienceID);
			expect(result.creator_id).to.equal(creatorID.toString());
			expect(result.audience_id).to.equal(audienceID.toString());
		});

		it('should return nothing', async function () {
			const result = await SubscriberService.getSubscription(creatorID, new mongoose.mongo.ObjectID());
			!expect(result).to.not.exist;
		});

		it('should return nothing', async function () {
			const result = await SubscriberService.getSubscription(creatorID, 'abc');
			expect(result).to.not.exist;
		});

		it('should return nothing', async function () {
			const result = await SubscriberService.getSubscription('abc', audienceID);
			expect(result).to.not.exist;
		});
	});
});
