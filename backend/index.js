const express = require('express');
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const apiRouter = require('./route/api-route');
const bodyParser = require('body-parser');
const passport = require('passport');
const User = require('./schema/user-schema');
const SubscriptionSchema = require('./schema/subscriber-schema');
const PostSchema = require('./schema/post-schema');
const LikeSchema = require('./schema/likes-schema');
const Subscription = require('./model/subscriber-model');
const Post = require('./service/post-service');
const Like = require('./service/likes-service');
const fs = require('fs');
require('./util/passport')(passport);
const extractEngine = require('./util/recommendation-engine');

const app = express();
mongoose
	.connect(process.env.TEST_MONGODB_CONNECTION, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() => {
		console.log('Success to connect mongodb');
	})
	.catch(() => {
		console.log('Fail to connect mongodb');
	});

app.use(bodyParser.json({extended: true}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

let creatorSize = 10;
let audienceSize = 50;

let fakePostsLib;

let audienceList = [];
let creatorList = [];
let subscriptionList = [];
let postList = [];
let likeList = [];

app.get('/getTestData', async (req, res) => {
	// create audience and creator users

	console.log('creating audiences...');
	for (let i = 0; i < audienceSize; i++) {
		let user = new User({
			_id: new mongoose.mongo.ObjectID(),
			username: 'user' + i.toString(),
			password: `user${i}Password!`,
			email: `user${i}@test.com`,
			is_writer: false,
			registration_date: Date.now(),
			last_login_date: null,
			bio: null,
			affiliation: null,
			profile_photo: '/sample_profile.jpg'
		});

		audienceList.push(user);
		await User.create(user);
	}

	console.log('creating creators...');
	for (let i = audienceSize; i < creatorSize + audienceSize; i++) {
		let user = new User({
			_id: new mongoose.mongo.ObjectID(),
			username: 'user' + i.toString(),
			password: `user${i}Password!`,
			email: `user${i}@test.com`,
			is_writer: true,
			registration_date: Date.now(),
			last_login_date: null,
			bio: null,
			affiliation: null,
			profile_photo: '/sample_profile.jpg'
		});

		creatorList.push(user);
		await User.create(user);
	}

	console.log('simulating subscription...');
	// some audiences subscribe some creators randomly
	for (let i = 0; i < creatorSize; i++) {
		for (let j = 0; j < audienceSize; j++) {
			if (Math.random() >= 0.7) {
				await Subscription.subscribeUser(creatorList[i]._id, audienceList[j]._id);
				subscriptionList.push({creator_id: creatorList[i]._id, audience_id: audienceList[j]._id});
			}
		}
	}


	// get fake posts from fakePosts.txt
	let allText = fs.readFileSync('./fakePosts.txt', 'utf8');
	fakePostsLib = allText.split('\n');


	console.log('simulating creating posts...');
	// simulate that some creators create some post
	while (fakePostsLib.length !== 0) {
		let content = fakePostsLib.pop();
		let creatorIndex = Math.floor(Math.random() * creatorSize);
		const keywords = await extractEngine.extractKeywords(content);
		let post = await Post.createPost(creatorList[creatorIndex]._id, content, keywords, null);
		postList.push(post);
	}

	console.log('simulating like...');
	// simulate that some audiences like some posts
	for (let i = 0; i < audienceList.length; i++) {
		for (let j = 0; j < postList.length; j++) {
			if (Math.random() >= 0.95) {
				let like = await Like.likePost(postList[j]._id, audienceList[i]._id);
				likeList.push(like);
			}
		}
	}

	console.log('generating report...');
	const writeStream = fs.createWriteStream('fakeDateReport.txt');
	writeStream.write('\t\t\t\t\t\t\t\tAudience List\t\t\n');
	writeStream.write('_id\t\t\t\t\t\t\tusername\temail\t\t\t\tpassword\t\tisWriter\t\n');
	audienceList.forEach((audience) => {
		writeStream.write(`${audience._id}\t${audience.username}\t\t${audience.email}\t\t${audience.password}\t${audience.is_writer}\t\n`);
	});

	writeStream.write('\n########################################################################################\n\n');
	writeStream.write('\t\t\t\t\t\t\t\tCreator List\t\t\n');
	writeStream.write('_id\t\t\t\t\t\t\tusername\temail\t\t\t\tpassword\t\tisWriter\t\n');
	creatorList.forEach((creator) => {
		writeStream.write(`${creator._id}\t${creator.username}\t\t${creator.email}\t\t${creator.password}\t${creator.is_writer}\t\n`);
	});

	writeStream.write('\n########################################################################################\n\n');
	writeStream.write('\t\t\t\t\t\t\t\tSubscription List\t\t\n');
	writeStream.write('creator_id\t\t\t\t\t\t\taudience_id\t\n');
	subscriptionList.forEach(subscription => {
		writeStream.write(`${subscription.creator_id}\t\t\t${subscription.audience_id}\t\n`);
	});

	writeStream.write('\n########################################################################################\n\n');
	writeStream.write('\t\t\t\t\t\t\t\tPosts List\t\t\n');
	writeStream.write('user_id\t\t\t\t\t\t\t\t\tcontent\t\n');
	postList.forEach(post => {
		writeStream.write(`${post.user_id}\t\t\t\t${post.content}\t\n`);
	});
	writeStream.write('\n########################################################################################\n\n');

	writeStream.write('\t\t\t\t\t\t\t\tLike List\t\t\n');
	writeStream.write('user_id\t\t\t\t\t\t\t\tpost_id\t\n');
	likeList.forEach(like => {
		writeStream.write(`${like.user_id}\t\t\t${like.post_id}\t\n`);
	});
	console.log('done');
	res.json('success');
});

app.get('/deleteTestData', async (req, res) => {
	console.log('deleting...');
	await User.deleteMany({});
	await User.create({
		_id: new mongoose.mongo.ObjectID(),
		username: 'weiyuuuqq',
		password: 'DeanPassqwrd1',
		email: 'dean@emaiqwwl.com',
		is_writer: false,
		registration_date: Date.now(),
		last_login_date: null,
		bio: null,
		affiliation: null,
		profile_photo: '/sample_profile.jpg'
	});
	await PostSchema.deleteMany({});
	await SubscriptionSchema.deleteMany({});
	await LikeSchema.deleteMany({});
	//fs.unlinkSync('./fakeDateReport.txt');
	res.json('success');
	console.log('done');
});


app.use('/api', apiRouter);

app.listen(process.env.PORT, () => {
	console.log(`Comp4350 backend is listening on port ${process.env.PORT}`);
});
