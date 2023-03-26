const services = require('../service/post-service');
const Like = require('../schema/likes-schema');
const sinon = require('sinon');
const Post = require('../schema/post-schema');
const mongoose = require('mongoose');
const expect = require('chai').expect;
require('dotenv').config();

const postsToDelete = [];

/* generatePosts
 *
 * Purpose: Generates a number of posts assigned to a number of users
 * Input:
 * numPosts - the number of posts to create
 * numUsers - the number of users who created the posts
 *
 * Output:
 * Returns an object with two properties:
 * posts - the posts created
 * userIDs - the user ids of the users that made the posts
 */
const generatePosts = async (numPosts, numUsers) => {
	const userIDs = [];
	const postIDs = [];
	let i = 0;

	// generate user ids
	for (i = 0; i < numUsers; i++) {
		userIDs.push(new mongoose.mongo.ObjectID());
	}

	// generate random posts created by numUsers users
	let attribs = [];
	for (i = 0; i < numPosts; i++) {
		postIDs.push(new mongoose.mongo.ObjectID());

		const attrib = { _id: postIDs[postIDs.length - 1], user_id: userIDs[i % numUsers], content: i, post_date: new Date(i * 1000000) };
		attribs.push(attrib)

		if (process.env.TEST_TYPE === 'INTEGRATION') {
			postsToDelete.push(postIDs[i]);
			await Post.create(attrib);
		} else {
			posts.push(new Post(attrib));
		}
	}
	return { postIDs, userIDs, attribs };
};

/* setFakeDatabase
 *
 * Purpose: Replaces the Model methods with methods that access a fake
 * database; used for unit testing
 */
const setFakeDatabase = () => {
	sinon.stub(Post, 'find').callsFake((obj1, obj2, obj3) => {
		let temp = [];

		if (obj1 !== undefined && 'user_id' in obj1) { // get all posts from users
			return posts.filter(post => { return post.user_id.equals(obj1.user_id); });
		}

		if (obj3 === undefined) { // get all posts
			return posts;
		}

		// get page from posts
		temp = posts.sort((a, b) => { return b.post_date - a.post_date; });

		if (obj3.skip < posts.length) {
			temp = temp.slice(obj3.skip, temp.length);
		} else {
			temp = [];
		}

		if (obj3.limit < temp.length) {
			return temp.slice(0, obj3.limit);
		}

		return temp.slice(0, temp.length);
	});

	sinon.stub(Post, 'findOne').callsFake(({ _id: id }) => {
		const matches = posts.filter(post => { return post._id.equals(id); });
		return (matches.length > 0) ? matches[0] : null;
	});

	sinon.stub(Post, 'create').callsFake(({ user_id, content, image }) => {
		const doc = new Post({ user_id, content, image });
		posts.push(doc);
	});

	sinon.stub(Post, 'findOneAndDelete').callsFake(({ _id: id }) => {
		posts = posts.filter(post => { return !post._id.equals(id); });
	});

	sinon.stub(Post, 'deleteMany').callsFake(({ user_id }) => {
		posts = posts.filter(post => { return !post.user_id.equals(user_id); });
	});

	sinon.stub(Post, 'findOneAndUpdate').callsFake(({ _id: id }, { content }) => {
		const doc = posts.find(item => item._id.equals(id));
		doc.content = content;
	});

	sinon.stub(Post, 'countDocuments').callsFake(({ user_id }) => {
		const postsFromUser = posts.filter(item => item.user_id.equals(user_id));
		return postsFromUser.length;
	});
};

let posts = []; // fake database

describe('Post services and model', function () {
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
			await Post.deleteMany({});//({_id: { $in: postsToDelete } });
		} else {
			posts = [];
		}
	});

	after(async () => {
		if (process.env.TEST_TYPE === 'INTEGRATION') {
			await Post.deleteMany({});//({_id: { $in: postsToDelete } });
			await mongoose.disconnect();
		} else {
			sinon.restore();
		}
	});

	describe('getAllPosts', function () {
		it('should return nothing', async function () {
			await generatePosts(0, 0);

			const value = await services.getAllPosts();
			expect(value.length).to.equal(0);
		});

		it('should return all the posts', async function () {
			await generatePosts(4, 4);

			const value = await services.getAllPosts();
			expect(value.length).to.equal(4);
		});
	});

	describe('getPageFromPosts', function () {
		it('should return all ten posts (content: 9-0)', async function () {
			await generatePosts(10, 1);

			const value = await services.getPageOfPosts(0, 10);

			expect(value).to.not.be.undefined;
			expect(value.length).to.exist;
			expect(value.length).to.equal(10);
			for (let i = 0; i < value.length; i++) {
				expect(value[i].content).to.equal((9 - i) + '');
			}
		});

		it('should return the first five posts (content: 4-0)', async function () {
			await generatePosts(10, 1);

			const value = await services.getPageOfPosts(1, 5);

			expect(value).to.not.be.undefined;
			expect(value.length).to.exist;
			expect(value.length).to.equal(5);
			for (let i = 0; i < value.length; i++) {
				expect(value[i].content).to.equal((4 - i) + '');
			}
		});

		it('should return posts with content 7 and 6', async function () {
			await generatePosts(10, 1);

			const value = await services.getPageOfPosts(1, 2);
			expect(value).to.not.be.undefined;
			expect(value.length).to.exist;
			expect(value.length).to.equal(2);
			expect(value[0].content).to.equal('7');
			expect(value[1].content).to.equal('6');
		});

		it('should return only one post despite page size being 2', async function () {
			await generatePosts(5, 1);

			const value = await services.getPageOfPosts(2, 2);
			expect(value).to.not.be.undefined;
			expect(value.length).to.exist;
			expect(value.length).to.equal(1);
			expect(value[0].content).to.equal('0');
		});

		it('should not return anything', async function () {
			await generatePosts(5, 1);

			const value = await services.getPageOfPosts(2, 5);
			expect(value).to.not.be.undefined;
			expect(value.length).to.exist;
			expect(value.length).to.equal(0);
		});
	});

	describe('getPostByID', function () {
		it('should return post with content of 1', async function () {
			const postIDs = (await generatePosts(5, 5)).postIDs;

			const value = await services.getPostByID(postIDs[1]);
			expect(value).to.not.be.null;
			expect(value.content).to.equal('1');
		});

		it('should return post with content 9', async function () {
			const postIDs = (await generatePosts(10, 10)).postIDs;

			const value = await services.getPostByID(postIDs[9]);
			expect(value).to.not.be.null;
			expect(value.content).to.equal('9');
		});

		it('should return nothing', async function () {
			await generatePosts(3, 3);

			const value = await services.getPostByID(new mongoose.mongo.ObjectID());
			expect(value).to.be.null;
		});
	});

	describe('getAllPostsFromUser', function () {
		it('should return all posts with even content', async function () {
			const userIDs = (await generatePosts(10, 2)).userIDs;

			const value = await services.getAllPostsFromUser(userIDs[0]);
			expect(value.length).to.equal(5);
			value.forEach(item => {
				expect(item.content % 2).to.equal(0);
			});
		});

		it('should return only one post with content 1', async function () {
			const userIDs = (await generatePosts(3, 2)).userIDs;

			const value = await services.getAllPostsFromUser(userIDs[1]);
			expect(value.length).to.equal(1);
			expect(value[0].content).to.equal('1');
		});

		it('should return nothing', async function () {
			const userIDs = (await generatePosts(9, 10)).userIDs;

			const value = await services.getAllPostsFromUser(userIDs[9]);
			expect(value).to.be.empty;
		});
	});

	describe('createPost', function () {
		it('should return nothing', async function () {
			const value = await services.getAllPosts();
			expect(value.length).to.equal(0);
		});

		it('should return one post', async function () {
			let post = new mongoose.mongo.ObjectID();
			postsToDelete.push(post);
			await services.createPost(post, '1', '1');

			const value = await services.getAllPosts();
			expect(value.length).to.equal(1);
		});

		it('should return two posts', async function () {
			let post = new mongoose.mongo.ObjectID();
			postsToDelete.push(post);
			await services.createPost(post, '0', '0');

			post = new mongoose.mongo.ObjectID();
			postsToDelete.push(post);
			await services.createPost(post, '1', '1');
			const value = await services.getAllPosts();
			expect(value.length).to.equal(2);
		});
	});

	describe('removePostByID', function () {
		it('should return one post', async function () {
			const postIDs = (await generatePosts(2, 2)).postIDs;

			await services.removePostByID(postIDs[0]);
			const value = await services.getAllPosts();
			expect(value.length).to.equal(1);
		});

		it('should return nothing', async function () {
			const postIDs = (await generatePosts(1, 1)).postIDs;

			await services.removePostByID(postIDs[0]);
			const value = await services.getAllPosts();
			expect(value.length).to.equal(0);
		});
	});

	describe('removeAllPostsFromUser', function () {
		it('should return only the posts with even content', async function () {
			const userIDs = (await generatePosts(10, 2)).userIDs;

			await services.removeAllPostsFromUser(userIDs[1]);
			const value = await services.getAllPosts();
			expect(value.length).to.equal(5);
			value.forEach(item => expect(item.content % 2).to.equal(0));
		});

		it('should return nothing', async function () {
			const userIDs = (await generatePosts(5, 1)).userIDs;

			await services.removeAllPostsFromUser(userIDs[0]);
			const value = await services.getAllPosts();
			expect(value.length).to.equal(0);
		});
	});

	describe('updateContent', function () {
		it('should show content = \'mitochondria\'', async function () {
			const postIDs = (await generatePosts(10, 10)).postIDs;
			await services.updateContent(postIDs[0], 'mitochondria', []);
			const value = await services.getPostByID(postIDs[0]);
			expect(value).to.not.be.null;
			expect(value.content).to.equal('mitochondria');
		});

		it('should show content = \' \'', async function () {
			const post = new mongoose.mongo.ObjectID();
			postsToDelete.push(post);
			await services.createPost(post, 'mitochondria', [], '0');
			const posts = await services.getAllPosts();
			await services.updateContent(posts[0]._id, ' ', []);
			const value = await services.getPostByID(posts[0]._id);
			expect(value).to.not.be.null;
			expect(value.content).to.equal(' ');
		});
	});

	describe('countPostsFromUser', function () {
		it('should return 0', async function () {
			const num = await services.countPostsFromUser(new mongoose.mongo.ObjectID());
			expect(num).to.equal(0);
		});

		it('should return 5', async function () {
			const userIDs = (await generatePosts(5, 1)).userIDs;

			const num = await services.countPostsFromUser(userIDs[0]);
			expect(num).to.equal(5);
		});

		it('should return 5', async function () {
			const userIDs = (await generatePosts(10, 2)).userIDs;

			const num = await services.countPostsFromUser(userIDs[1]);
			expect(num).to.equal(5);
		});
	});
});
