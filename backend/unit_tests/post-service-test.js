const PostServices = require('../service/post-service');
const sinon = require("sinon");
const Post = require('../schema/post-schema');
const mongoose = require('mongoose');
const expect = require('chai').expect;
require("dotenv").config();

const useRealDatabase = false;

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
    let userIDs = [];
    let postIDs = [];
    let i = 0;

    //generate user ids
    for (i = 0; i < numUsers; i++) {
        userIDs.push(new mongoose.mongo.ObjectID);
    }

    //generate random posts created by numUsers users
    for (i = 0; i < numPosts; i++) {
        postIDs.push(new mongoose.mongo.ObjectID);

        if (useRealDatabase) {
            await Post.create({_id: postIDs[postIDs.length - 1], user_id: userIDs[i % numUsers], content: i});
        }
        else {
            posts.push(new Post({_id: postIDs[postIDs.length - 1], user_id: userIDs[i % numUsers], content: i}));
        }
    }

    return { postIDs, userIDs };
}

/* setFakeDatabase
 *
 * Purpose: Replaces the Model methods with methods that access a fake
 * database; used for unit testing
 */
const setFakeDatabase = () => {
    sinon.stub(Post, 'find').callsFake((obj) => {
        if (obj !== undefined && 'user_id' in obj) { 
            return posts.filter(post => { return post.user_id.equals(obj.user_id); });
        }
        return posts; 
    });

    sinon.stub(Post, 'findOne').callsFake(({_id: id}) => {
        const matches = posts.filter(post => { return post._id.equals(id); });
        return (matches.length > 0) ? matches[0] : null;
    });

    sinon.stub(Post, 'create').callsFake(({user_id, content, image}) => {
        const doc = new Post({user_id, content, image});
        posts.push(doc);
    });

    sinon.stub(Post, 'findOneAndDelete').callsFake(({_id: id}) => {
        posts = posts.filter(post => { return !post._id.equals(id); });
    });

    sinon.stub(Post, 'deleteMany').callsFake(({user_id}) => {
        posts = posts.filter(post => { return !post.user_id.equals(user_id); });
    });

    sinon.stub(Post, 'findOneAndUpdate').callsFake(({_id: id}, {content}) => {
        const doc = posts.find(item => item._id.equals(id));
        doc.content = content;
    });

    sinon.stub(Post, 'countDocuments').callsFake(({user_id}) => {
        const postsFromUser = posts.filter(item => item.user_id.equals(user_id));
        return postsFromUser.length;
    });
};

const services = new PostServices();
let posts = []; //fake database

describe('Post services and model', function () {

    //clear out the posts array
    beforeEach(async () => {
        if (useRealDatabase) {
            mongoose
            .connect(process.env.MONGODB_CONNECTION, {
                useNewUrlParser: true,
                useUnifiedTopology: true,})
                .then(() => {console.log("Success to connect mongodb");})
                .catch(() => {console.log("Fail to connect mongodb")});

            await Post.deleteMany({});
        }
        else {
            posts = [];
            setFakeDatabase();
        }
    });

    //get rid of all stubs
    afterEach(async () => {
        if (useRealDatabase) {
            await mongoose.disconnect();
        }
        else {
            sinon.restore();
        }
    });

    describe('getAllPosts', function() {

        it('should return nothing', async function() {
            await generatePosts(0, 0);
            
            const value = await services.getAllPosts();
            expect(value.length).to.equal(0);
        });

        it('should return all the posts', async function() {
            await generatePosts(4, 4);

            const value = await services.getAllPosts();
            expect(value.length).to.equal(4);
        });
    });

    describe('getPostByID', function() {

        it('should return post with content of 1', async function() {
            const postIDs = (await generatePosts(5, 5)).postIDs;

            const value = await services.getPostByID(postIDs[1]);
            expect(value).to.not.be.null;
            expect(value.content).to.equal('1');
        });

        it('should return post with content 9', async function() {
            const postIDs = (await generatePosts(10, 10)).postIDs;

            const value = await services.getPostByID(postIDs[9]);
            expect(value).to.not.be.null;
            expect(value.content).to.equal('9');
        })

        it('should return nothing', async function() {
            await generatePosts(3, 3);

            const value = await services.getPostByID(new mongoose.mongo.ObjectID);
            expect(value).to.be.null;
        })
    });

    describe('getAllPostsFromUser', function() {

        it('should return all posts with even content', async function() {
            const userIDs = (await generatePosts(10, 2)).userIDs;

            const value = await services.getAllPostsFromUser(userIDs[0]);
            expect(value.length).to.equal(5);
            value.forEach(item => {
                expect(item.content % 2).to.equal(0);
            });
        });

        it('should return only one post with content 1', async function() {
            const userIDs = (await generatePosts(3, 2)).userIDs;

            const value = await services.getAllPostsFromUser(userIDs[1]);
            expect(value.length).to.equal(1);
            expect(value[0].content).to.equal('1');
        });

        it('should return nothing', async function() {
            const userIDs = (await generatePosts(9, 10)).userIDs;

            const value = await services.getAllPostsFromUser(userIDs[9]);
            expect(value).to.be.empty;
        });
    });

    describe('createPost', function() {

        it('should return nothing', async function() {

            const value = await services.getAllPosts();
            expect(value.length).to.equal(0);
        });

        it('should return one post', async function() {

            await services.createPost(new mongoose.mongo.ObjectID, '1', '1');

            const value = await services.getAllPosts();
            expect(value.length).to.equal(1);
        });

        it('should return two posts', async function() {

            await services.createPost(new mongoose.mongo.ObjectID, '0', '0');
            await services.createPost(new mongoose.mongo.ObjectID, '1', '1');

            const value = await services.getAllPosts();
            expect(value.length).to.equal(2);
        });
    });

    describe('removePostByID', function() {

        it('should return one post', async function() {
            const postIDs = (await generatePosts(2, 2)).postIDs;

            await services.removePostByID(postIDs[0]);
            const value = await services.getAllPosts();
            expect(value.length).to.equal(1);
        });

        it('should return nothing', async function() {
            const postIDs = (await generatePosts(1, 1)).postIDs;

            await services.removePostByID(postIDs[0]);
            const value = await services.getAllPosts();
            expect(value.length).to.equal(0);
        });
    });

    describe('removeAllPostsFromUser', function() {

        it('should return only the posts with even content', async function() {
            const userIDs = (await generatePosts(10, 2)).userIDs;

            await services.removeAllPostsFromUser(userIDs[1]);
            const value = await services.getAllPosts();
            expect(value.length).to.equal(5);
            value.forEach(item => expect(item.content % 2).to.equal(0));
        });

        it('should return nothing', async function() {
            const userIDs = (await generatePosts(5, 1)).userIDs;

            await services.removeAllPostsFromUser(userIDs[0]);
            const value = await services.getAllPosts();
            expect(value.length).to.equal(0);
        });
    });

    describe('updateContent', function() {

        it('should show content = \'mitochondria\'', async function() {
            const postIDs = (await generatePosts(10, 10)).postIDs;

            await services.updateContent(postIDs[0], 'mitochondria');
            const value = await services.getPostByID(postIDs[0]);
            expect(value).to.not.be.null;
            expect(value.content).to.equal('mitochondria');
        });

        it('should show content = \' \'', async function() {

            await services.createPost(new mongoose.mongo.ObjectID, 'mitochondria', '0');
            const posts = await services.getAllPosts();
            await services.updateContent(posts[0]._id, ' ');
            const value = await services.getPostByID(posts[0]._id);
            expect(value).to.not.be.null;
            expect(value.content).to.equal(' ');
        });
    });

    describe('countPostsFromUser', function() {

        it('should return 0', async function() {
            const num = await services.countPostsFromUser(new mongoose.mongo.ObjectID);
            expect(num).to.equal(0);
        });

        it('should return 5', async function() {
            const userIDs = (await generatePosts(5, 1)).userIDs;

            const num = await services.countPostsFromUser(userIDs[0]);
            expect(num).to.equal(5);
        });

        it('should return 5', async function() {
            const userIDs = (await generatePosts(10, 2)).userIDs;

            const num = await services.countPostsFromUser(userIDs[1]);
            expect(num).to.equal(5);
        });
    });
});