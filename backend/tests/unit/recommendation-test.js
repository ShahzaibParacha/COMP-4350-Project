const services = require('../../service/post-service');
const Like = require('../../schema/likes-schema');
const Post = require('../../schema/post-schema');
const extractEngine = require('../../util/extract-keywords');
const mongoose = require('mongoose');
const sinon = require('sinon');
const expect = require('chai').expect;
require('dotenv').config();

const userIDs = [];
const postIDs = [];
let similarPosts;

/* generatePosts
 *
 * Purpose: Generates a number of posts assigned to a number of users, and users like the posts
 *
 */
const generatePosts = async () => {
	let i = 0;

	// generate user ids
	for (i = 0; i < 2; i++) {
		userIDs.push(new mongoose.mongo.ObjectID());
	}

	// generate random posts created by numUsers users
	let contents = ["A friend is someone who knows the song in your heart and can sing it back to you when you have forgotten the words.",
	 				"A true friend is someone who sees the pain in your eyes while everyone else believes the smile on your face.",
					"A true friend is someone who sees the pain in your eyes while everyone else believes the smile on your face. Love you!",
	  				"A book is a map to a new world waiting to be explored."]
	for (i = 0; i < 3; i++) {
		postIDs.push(new mongoose.mongo.ObjectID());

		const attrib = { _id: postIDs[i], user_id: userIDs[1], content: contents[i], post_date: new Date(i * 1000000) };
		const like_attr = {user_id: userIDs[0], post_id: postIDs[i]};

		await Post.create(attrib);
		await extractEngine.extractKeywords(contents[i])
			.then(keywords => {
				Post.findOneAndUpdate({ _id: postIDs[i] }, { keywords: keywords }, { useFindAndModify: false })
				.then(result => {});
			});	
		if (i === 0){
			await Like.create( like_attr );
		}
	}
	await Like.create({user_id: userIDs[0], post_id: postIDs[1]});
};

describe('Recommendation Service test', function () {
	before(async () => {
		await mongoose
			.connect(process.env.MONGODB_CONNECTION, {
				useNewUrlParser: true,
				useUnifiedTopology: true
			})
			.then(() => { console.log('Success to connect mongodb'); })
			.catch(() => { console.log('Fail to connect mongodb'); });

		await Post.deleteMany({});
		await generatePosts();
		similarPosts = await Post.find({ _id: { $in: postIDs.slice(1, 3) }});

		// stub mongoose
		sinon.stub(Post, "aggregate").callsFake((obj) => {
			return { exec: () => { return similarPosts; }};
		});
	});

	after(async () => {
		sinon.restore();
		await Post.deleteMany({});
		await Like.deleteMany({});
		await mongoose.disconnect();
	});

	describe('getRecommendedPosts', function () {
		it('should return nothing', async function () {
			const value = await services.getRecommendedPosts(userIDs[1]);
			expect(value.length).to.equal(0);
		});

		it('should return an array of recommended post, it contains one post.', async function () {
			const values = await services.getRecommendedPosts(userIDs[0]);
			expect(values).to.be.an('array');
			expect(values.length).to.equal(2);
		});
	});
});
