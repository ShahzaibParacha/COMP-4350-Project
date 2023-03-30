const services = require('../service/post-service');
const Like = require('../schema/likes-schema');
const Post = require('../schema/post-schema');
const mongoose = require('mongoose');
const expect = require('chai').expect;
require('dotenv').config();

const postsToDelete = [];
const likesToDelete = [];

/* generatePosts
 *
 * Purpose: Generates a number of posts assigned to a number of users, and users like the posts
 *
 * Output:
 * Returns an object with two properties:
 * postIDs - the posts IDs created
 * userIDs - the user ids of the users that made the 
 * likes - the likes created
 */
const generatePosts = async () => {
	const userIDs = [];
	const postIDs = [];
	const likes = [];
	let i = 0;

	// generate user ids
	for (i = 0; i < 2; i++) {
		userIDs.push(new mongoose.mongo.ObjectID());
	}

	// generate random posts created by numUsers users
	let contents = ["A friend is someone who knows the song in your heart and can sing it back to you when you have forgotten the words.",
	 				"A true friend is someone who sees the pain in your eyes while everyone else believes the smile on your face.",
	  				"A book is a map to a new world waiting to be explored.",
	   				"The best time to plant a tree was 20 years ago. The second-best time is now. - Chinese proverb"]
	for (i = 0; i < 4; i++) {
		postIDs.push(new mongoose.mongo.ObjectID());

		const attrib = { _id: postIDs[i], user_id: userIDs[1], content: contents[i], post_date: new Date(i * 1000000) };
		const like_attr = {user_id: userIDs[0], post_id: postIDs[i]};

		postsToDelete.push(postIDs[i]);
		await Post.create(attrib);
		if (i === 0){
			likesToDelete.push(userIDs[0]);
			await Like.create( like_attr );
		}
	}
	return { postIDs, userIDs, likes };
};


describe('Recommendation Service test', function () {
	before(async () => {
		mongoose
			.connect(process.env.MONGODB_CONNECTION, {
				useNewUrlParser: true,
				useUnifiedTopology: true
			})
			.then(() => { console.log('Success to connect mongodb'); })
			.catch(() => { console.log('Fail to connect mongodb'); });

	});

	beforeEach(async () => {
		await Post.deleteMany({_id: { $in: postsToDelete } });
	});

	after(async () => {
		await Post.deleteMany({_id: { $in: postsToDelete } });
		await Like.deleteMany({user_id: { $in: likesToDelete }});
		await mongoose.disconnect();
	});

	describe('getRecommendedPosts', function () {
		it('should return nothing', async function () {
			const { userIDs } = (await generatePosts() );

			const value = await services.getRecommendedPosts(userIDs[1]);
			expect(value.length).to.equal(0);
		});

		it('should return an array of recommendated post, it could be empty.', async function () {
			const { userIDs, postIDs, likes } = (await generatePosts());
            const values = await services.getRecommendedPosts(userIDs[0]);

            expect(values).to.be.an('array');
		});
	});
});
