const PostServices = require('./post-service');
const sinon = require("sinon");
const Post = require('../schema/post-schema');
const mongoose = require('mongoose');
const expect = require('chai').expect;

const generatePosts = (numPosts, numUsers) => {
    let posts = [];
    let userIDs = [];
    let i = 0;

    //generate user ids
    for (i = 0; i < numUsers; i++) {
        userIDs.push(new mongoose.mongo.ObjectID);
    }

    //generate random posts created by numUsers users
    for (i = 0; i < numPosts; i++) {
        posts.push(new Post({user_id: userIDs[i % numUsers], content: i}));
    }

    return { posts, userIDs };
}

const findAllStub = () => {
    sinon.stub(Post, 'find').callsFake(() => {
        return posts; 
    });
};

const findOneByIDStub = () => {
    sinon.stub(Post, 'findOne').callsFake(({_id: id}) => {
        return posts.filter(post => { return post._id.equals(id); });
    });
};

const findFromUserStub = () => {
    sinon.stub(Post, 'find').callsFake(({user_id}) => {
        return posts.filter(post => { return post.user_id.equals(user_id); });
    });
};

const createStub = () => {
    sinon.stub(Post, 'create').callsFake(({user_id, content, image}) => {
        const doc = new Post({user_id, content, image});
        posts.push(doc);
    });
};

const findOneAndDeleteStub = () => {
    sinon.stub(Post, 'findOneAndDelete').callsFake(({_id: id}) => {
        posts = posts.filter(post => { return !post._id.equals(id); });
    });
};

const deleteManyStub = () => {
    sinon.stub(Post, 'deleteMany').callsFake(({user_id}) => {
        posts = posts.filter(post => { return !post.user_id.equals(user_id); });
    });
};

const findOneAndUpdateLikesStub = () => {
    sinon.stub(Post, 'findOneAndUpdate').callsFake(({_id: id}, {likes}) => {
        const doc = posts.find(item => item._id.equals(id));
        doc.likes = likes;
    });
};

const findOneAndUpdateContentStub = () => {
    sinon.stub(Post, 'findOneAndUpdate').callsFake(({_id: id}, {content}) => {
        const doc = posts.find(item => item._id.equals(id));
        doc.content = content;
    });
};

const services = new PostServices();
let posts = [];

describe('Post services and model', function () {

    //clear out the posts array
    beforeEach(() => {
        posts = [];
    });

    //get rid of all stubs
    afterEach(() => {
        sinon.restore();
    });

    describe('getAllPosts', function() {

        beforeEach(() => findAllStub());

        it('should return nothing', async function() {
            posts = generatePosts(0, 0).posts;
            
            const value = await services.getAllPosts();
            expect(value.length).to.equal(0);
        });

        it('should return all the posts', async function() {
            posts = generatePosts(4, 4).posts;

            const value = await services.getAllPosts();
            expect(value.length).to.equal(4);
        });
    });

    describe('getPostByID', function() {

        beforeEach(() => findOneByIDStub());

        it('should return post with content of 1', async function() {
            posts = generatePosts(5, 5).posts;

            const value = await services.getPostByID(posts[1]._id);
            expect(value[0].content).to.equal('1');
        });

        it('should return post with content 9', async function() {
            posts = generatePosts(10, 10).posts;

            const value = await services.getPostByID(posts[9]._id);
            expect(value[0].content).to.equal('9');
        })

        it('should return nothing', async function() {
            posts = generatePosts(3, 3).posts;

            const value = await services.getPostByID(new mongoose.mongo.ObjectID);
            expect(value).to.be.empty;
        })
    });

    describe('getAllPostsFromUser', function() {
    
        beforeEach(() => findFromUserStub());

        it('should return all posts with even content', async function() {
            data = generatePosts(10, 2);
            posts = data.posts;
            userIDs = data.userIDs;

            const value = await services.getAllPostsFromUser(userIDs[0]);
            expect(value.length).to.equal(5);
            value.forEach(item => {
                expect(item.content % 2).to.equal(0);
            });
        });

        it('should return only one post with content 1', async function() {
            data = generatePosts(3, 2);
            posts = data.posts;
            userIDs = data.userIDs;

            const value = await services.getAllPostsFromUser(userIDs[1]);
            expect(value.length).to.equal(1);
            expect(value[0].content).to.equal('1');
        });

        it('should return all posts with even content', async function() {
            data = generatePosts(10, 2);
            posts = data.posts;
            userIDs = data.userIDs;

            const value = await services.getAllPostsFromUser(userIDs[0]);
            expect(value.length).to.equal(5);
            value.forEach(item => {
                expect(item.content % 2).to.equal(0);
            });
        });

        it('should return nothing', async function() {
            data = generatePosts(9, 10);
            posts = data.posts;
            userIDs = data.userIDs;

            const value = await services.getAllPostsFromUser(userIDs[9]);
            expect(value).to.be.empty;
        });
    });

    describe('createPost', function() {
    
        beforeEach(() => {
            findAllStub();
            createStub();
        });

        it('should return nothing', async function() {
            posts = [];

            const value = await services.getAllPosts();
            expect(value.length).to.equal(0);
        });

        it('should return one post', async function() {
            posts = [];

            await services.createPost(new mongoose.mongo.ObjectID, '1', '1');

            const value = await services.getAllPosts();
            expect(value.length).to.equal(1);
        });

        it('should return two posts', async function() {
            posts = [];

            await services.createPost(new mongoose.mongo.ObjectID, '0', '0');
            await services.createPost(new mongoose.mongo.ObjectID, '1', '1');

            const value = await services.getAllPosts();
            expect(value.length).to.equal(2);
        });
    });

    describe('removePostByID', function() {
    
        beforeEach(() => {
            findAllStub();
            findOneAndDeleteStub();
        });

        it('should return one post', async function() {
            posts = generatePosts(2, 2).posts;

            await services.removePostByID(posts[0]._id);
            const value = await services.getAllPosts();
            expect(value.length).to.equal(1);
        });

        it('should return nothing', async function() {
            posts = generatePosts(1, 1).posts;

            await services.removePostByID(posts[0]._id);
            const value = await services.getAllPosts();
            expect(value.length).to.equal(0);
        });
    });

    describe('removeAllPostsFromUser', function() {
    
        beforeEach(() => {
            findAllStub();
            deleteManyStub();
        });

        it('should return only the posts with even content', async function() {
            data = generatePosts(10, 2);
            posts = data.posts;
            userIDs = data.userIDs;

            await services.removeAllPostsFromUser(userIDs[1]);
            const value = await services.getAllPosts();
            expect(value.length).to.equal(5);
            value.forEach(item => expect(item.content % 2).to.equal(0));
        });

        it('should return nothing', async function() {
            data = generatePosts(5, 1);
            posts = data.posts;
            userIDs = data.userIDs;

            await services.removeAllPostsFromUser(userIDs[0]);
            const value = await services.getAllPosts();
            expect(value.length).to.equal(0);
        });
    });

    describe('updateLikes', function() {
    
        beforeEach(() => {
            findOneByIDStub();
            findOneAndUpdateLikesStub();
        });

        it('should show likes = 69', async function() {
            posts = generatePosts(10, 10).posts;

            await services.updateLikes(posts[0]._id, 69);
            const value = await services.getPostByID(posts[0]._id);
            expect(value[0].likes).to.equal(69);
        });

        it('should show likes = 0', async function() {
            posts = generatePosts(10, 10).posts;

            await services.updateLikes(posts[0]._id, -420);
            const value = await services.getPostByID(posts[0]._id);
            expect(value[0].likes).to.equal(0);
        });
    });

    describe('updateContent', function() {
    
        beforeEach(() => {
            createStub();
            findOneByIDStub();
            findOneAndUpdateContentStub();
        });

        it('should show content = \'mitochondria\'', async function() {
            posts = generatePosts(10, 10).posts;

            await services.updateContent(posts[0]._id, 'mitochondria');
            const value = await services.getPostByID(posts[0]._id);
            expect(value[0].content).to.equal('mitochondria');
        });

        it('should show content = \' \'', async function() {
            posts = [];

            await services.createPost(new mongoose.mongo.ObjectID, 'mitochondria', '0');
            await services.updateContent(posts[0]._id, ' ');
            const value = await services.getPostByID(posts[0]._id);
            expect(value[0].content).to.equal(' ');
        });
    });
});