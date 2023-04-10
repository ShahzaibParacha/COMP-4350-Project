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
const { writer } = require('repl');
const marked = require('marked');

const app = express();
mongoose
  .connect(process.env.PROD_MONGODB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Success to connect mongodb");
  })
  .catch(() => {
    console.log("Fail to connect mongodb");
  });

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

let creatorSize =5; // 10;
let audienceSize = 25;// 50;

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
	// let allText = fs.readFileSync('./util/fakePosts.txt', 'utf8');
	// fakePostsLib = allText.split('\n');

	//try Dean's sample posts instead:
	let data = fs.readFileSync("./util/sampledata.txt", 'utf8');
	const s = data.toString().split('"');
	let i = 0;
	while (i < s.length) {
		if (s[i].length < 5) {
			s.splice(i, 1);
		}
		i++;
	}
	fakePostsLib = s;

	console.log('simulating creating posts...');
	// simulate that some creators create some post
	let count = 0;
	async function loop() {
		count += 1;
		console.log("generate keywords for post[" + count +"]:");
	  
		let content = fakePostsLib.pop();
		let creatorIndex = Math.floor(Math.random() * creatorSize);
		return Post.createPost(creatorList[creatorIndex]._id, content, true)
		  .then(post => {
			postList.push(post);
		  });
	  }

	  async function createPosts() {
		if (fakePostsLib.length > 0) {
		  await loop();
		  if (count % 30 === 0) {
			console.log("wait for 30 seconds to go on...");
			setTimeout(createPosts, 3000); //31000 for monkeyLearn
		  } else {
			setTimeout(createPosts, 3000); //1000 for monkeyLearn
		  }
		} else {
			await generateLikes();
			writeReport();
		  	console.log("Finally")
		}
	  }
	  
	  createPosts();
	
	async function generateLikes(){
		console.log("The count for the posts: " + postList.length);
		console.log('simulating like...');
		// simulate that some audiences like some posts
		for (let audience of audienceList) {
			for (let post of postList) {
				if (Math.random() >= 0.95) {
					let like = await Like.likePost(post._id, audience._id);
					likeList.push(like);
				}
			}
		}
	}

	function writeReport(){
		console.log('generating report...');
		const writeStream = fs.createWriteStream('./util/fakeDateReport.txt');
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
	}



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

app.use("/api", apiRouter);

app.listen(process.env.PORT, () => {
  console.log(`Comp4350 backend is listening on port ${process.env.PORT}`);
});
