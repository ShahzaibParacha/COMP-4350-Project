const sinon = require('sinon');
const Like = require('../schema/likes-schema');
const mongoose = require('mongoose');
const services = require('../service/likes-service');
const expect = require('chai').expect;
require('dotenv').config();

/* generateLikes
 *
 * Purpose: Generates a number of likes documents
 * Input:
 * numPosts - the number of posts to create
 * numUsers - the number of users who liked the posts
 * numLikes - the number of times a user likes a post
 *
 * Output:
 * Returns an object with two properties:
 * postIDs - the ids of the posts that got liked
 * userIDs - the user ids of the users that liked the posts
 */
const generateLikes = async (numPosts, numUsers, numLikes) => {
	const postIDs = [];
	const userIDs = [];
	let i = 0; let userIdx = 0; let postIdx = 0;

	if (numLikes <= numPosts * numUsers) {
		// generate user ids
		for (i = 0; i < numUsers; i++) {
			userIDs.push(new mongoose.mongo.ObjectID());
		}

		// generate random posts created by numUsers users
		for (i = 0; i < numPosts; i++) {
			postIDs.push(new mongoose.mongo.ObjectID());
		}

		// the first user will like the first post
		// the second user will like the first post
		// ...
		// the last user will like the first post
		// the first user will like the second post
		// ...
		// the last user will like the last post
		for (i = 0; i < numLikes; i++) {
			if (process.env.TEST_TYPE === 'INTEGRATION') {
				await Like.create({ post_id: postIDs[postIdx], user_id: userIDs[userIdx] });
			} else {
				likes.push(new Like({ post_id: postIDs[postIdx], user_id: userIDs[userIdx] }));
			}

			userIdx++;
			if (userIdx >= numUsers) {
				userIdx = 0;
				postIdx = (postIdx + 1) % numPosts;
			}
		}
	}

	return { postIDs, userIDs };
};

/* setFakeDatabase
 *
 * Purpose: Replaces the Model methods with methods that access a fake
 * database; used for unit testing
 */
const setFakeDatabase = () => {
	sinon.stub(Like, 'countDocuments').callsFake((obj) => {
		if ('user_id' in obj) {
			return likes.filter(item => item.post_id.equals(obj.post_id) && item.user_id.equals(obj.user_id)).length;
		}
		return likes.filter(item => item.post_id.equals(obj.post_id)).length;
	});

	sinon.stub(Like, 'create').callsFake(({ post_id, user_id }) => {
		likes.push(new Like({ post_id, user_id }));
	});

	sinon.stub(Like, 'findOneAndDelete').callsFake(({ post_id, user_id }) => {
		likes = likes.filter(item => !(item.user_id.equals(user_id) && item.post_id.equals(post_id)));
	});
};

let likes = []; // fake database

describe('Like services and model', function () {
	before(async () => {
		if (process.env.TEST_TYPE === 'INTEGRATION') {
			mongoose
				.connect(process.env.TEST_MONGODB_CONNECTION, {
					useNewUrlParser: true,
					useUnifiedTopology: true
				})
				.then(() => { console.log('Success to connect mongodb'); })
				.catch(() => { console.log('Fail to connect mongodb'); });
		} else {
			setFakeDatabase();
		}
	});

	beforeEach(async () => {
		if (process.env.TEST_TYPE === 'INTEGRATION') {
			await Like.deleteMany({});
		} else {
			likes = [];
		}
	});

	after(async () => {
		if (process.env.TEST_TYPE === 'INTEGRATION') {
			await Like.deleteMany({});
			await mongoose.disconnect();
		} else {
			sinon.restore();
		}
	});

	describe('getNumLikes', function () {
		it('should return 0', async function () {
			const value = await services.getNumLikes(new mongoose.mongo.ObjectID());

			expect(value).to.equal(0);
		});

		it('should return 1', async function () {
			const postIDs = (await generateLikes(5, 1, 4)).postIDs;

			const value = await services.getNumLikes(postIDs[2]);
			expect(value).to.equal(1);
		});

		it('should return 3', async function () {
			const postIDs = (await generateLikes(5, 5, 13)).postIDs;

			const value = await services.getNumLikes(postIDs[2]);
			expect(value).to.equal(3);
		});
	});

	describe('userLikedPost', function () {
		it('should return false', async function () {
			const value = await services.userLikedPost(new mongoose.mongo.ObjectID(), new mongoose.mongo.ObjectID());

			expect(value).to.equal(false);
		});

		it('should return true', async function () {
			const data = await generateLikes(5, 5, 4);
			const userIDs = data.userIDs;
			const postIDs = data.postIDs;

			const value = await services.userLikedPost(postIDs[0], userIDs[3]);
			expect(value).to.equal(true);
		});

		it('should return false', async function () {
			const data = await generateLikes(5, 5, 4);
			const userIDs = data.userIDs;
			const postIDs = data.postIDs;

			const value = await services.userLikedPost(postIDs[0], userIDs[4]);
			expect(value).to.equal(false);
		});
	});

	describe('likePost', function () {
		it('should say that user liked post', async function () {
			const data = await generateLikes(5, 1, 0);
			const userIDs = data.userIDs;
			const postIDs = data.postIDs;

			let value = await services.userLikedPost(postIDs[0], userIDs[0]);
			expect(value).to.equal(false);

			value = await services.getNumLikes(postIDs[0]);
			expect(value).to.equal(0);

			await services.likePost(postIDs[0], userIDs[0]);
			value = await services.userLikedPost(postIDs[0], userIDs[0]);
			expect(value).to.equal(true);

			value = await services.getNumLikes(postIDs[0]);
			expect(value).to.equal(1);
		});

		it('should not increase the number of likes of the post', async function () {
			const data = await generateLikes(5, 1, 1);
			const userIDs = data.userIDs;
			const postIDs = data.postIDs;

			let value = await services.getNumLikes(postIDs[0]);
			expect(value).to.equal(1);

			await services.likePost(postIDs[0], userIDs[0]);
			value = await services.getNumLikes(postIDs[0]);
			expect(value).to.equal(1);
		});
	});

	describe('unlikePost', function () {
		it('should reduce the number of likes', async function () {
			const data = await generateLikes(5, 5, 10);
			const userIDs = data.userIDs;
			const postIDs = data.postIDs;

			let value = await services.getNumLikes(postIDs[0]);
			expect(value).to.equal(5);

			await services.unlikePost(postIDs[0], userIDs[0]);
			value = await services.getNumLikes(postIDs[0]);
			expect(value).to.equal(4);
		});

		it('should not reduce the number of likes', async function () {
			const data = await generateLikes(5, 5, 9);
			const userIDs = data.userIDs;
			const postIDs = data.postIDs;

			let value = await services.getNumLikes(postIDs[1]);
			expect(value).to.equal(4);

			await services.unlikePost(postIDs[1], userIDs[4]);
			value = await services.getNumLikes(postIDs[1]);
			expect(value).to.equal(4);
		});
	});
});
