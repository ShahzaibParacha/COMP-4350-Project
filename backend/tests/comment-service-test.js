const services = require('../service/comment-service');
const sinon = require("sinon");
const Comment = require('../schema/comment-schema');
const mongoose = require('mongoose');
const expect = require('chai').expect;

/* generateComments
 *
 * Purpose: Generates a number of comments assigned to a one post made by a number of users
 * Input:
 * numComments - the number of comments to create
 * numUsers - the number of users who made the comments 
 * 
 * Output:
 * Returns an object with three properties:
 * post: the post that own the comments
 * comments - the comments created
 * userIDs - the user_ids made those comments
 */


const post = mongoose.mongo.ObjectID();

const generateComments = (numComments, numUsers) => {
    //let post = mongoose.mongo.ObjectID();
    let comments = [];
    let userIDs = [];
    let i = 0;

    //generate user ids
    for (i = 0; i < numUsers; i++) {
        userIDs.push( new mongoose.mongo.ObjectID() );
    }

    //generate random comments for the post above
    for (i = 0; i < numComments; i++) {
        comments.push(new Comment({post_id: post, user_id: userIDs[i % numUsers], content: i}));
    }

    return {post, comments, userIDs };
}

//setFakeDatabase
//
//Purpose: Replaces the Model methods with methods that access a fake
// database; used for unit testing
//
const setFakeDatabase = () => {
    sinon.stub(Comment, 'create').callsFake(({post_id, user_id, content}) => {
        const doc = new Comment({post_id, user_id, content});
        comments.push(doc);
    });

    //get all comments to the post
    sinon.stub(Comment, 'find').callsFake((obj) => {
        if (obj !== undefined && 'post_id' in obj) { 
            return comments.filter(comment => { return comment.post_id.equals(obj.post_id); });
        }
        return comments; 
    });

    sinon.stub(Comment, 'findOne').callsFake(({_id: id}) => {
        return comments.filter(comment => { return comment._id.equals(id); });
    });

    sinon.stub(Comment, 'findOneAndDelete').callsFake(({_id: id}) => {
        comments = comments.filter(comment => { return !comment._id.equals(id); });
    });

    sinon.stub(Comment, 'deleteMany').callsFake(({post_id}) => {
        comments = comments.filter(comment => { return !comment.post_id.equals(post_id); });
    });

    sinon.stub(Comment, 'findOneAndUpdate').callsFake(({_id: id}, obj) => {
        const doc = comments.find(item => item._id.equals(id));
        doc.content = obj.content;
    });
};

let comments = []; //fake database

describe('Comments services and model', function () {

    //clear out the comments array
    beforeEach(() => {
        comments = [];
        setFakeDatabase();
    });

    //get rid of all stubs
    afterEach(() => {
        sinon.restore();
    });

    describe('getAllCommentsFromPost', function() {

        it('should return nothing', async function() {
            comments = generateComments(0, 0).comments;
            
            const value = await services.getAllCommentsFromPost(post);
            expect(value.length).to.equal(0);
        });

        it('should return all the comments to the post', async function() {
            comments = generateComments(4, 4).comments;

            const value = await services.getAllCommentsFromPost(post);
            expect(value.length).to.equal(4);
        });
    });

    describe('createComment', function() {

        it('should return nothing', async function() {
            comments = [];

            const value = await services.getAllCommentsFromPost(post);
            expect(value.length).to.equal(0);
        });

        it('should return one comment', async function() {
            comments = [];
            await services.createComment(post, '0', '0');
            await services.createComment(post, '0', '1');
            const value = await services.getAllCommentsFromPost(post);
            expect(value.length).to.equal(2);
        });
    });

    describe('getComment', function() {

        it('should return comment with content of 1', async function() {
            comments = generateComments(5, 5).comments;

            const value = await services.getComment(comments[1]._id);
            expect(value[0].content).to.equal('1');
        });

        it('should return nothing', async function() {
            comments = generateComments(3, 3).comments;

            const value = await services.getComment(new mongoose.mongo.ObjectID());
            expect(value).to.be.empty;
        })
    });

    describe('removeComment', function() {

        it('should return one comment', async function() {
            comments = generateComments(2, 2).comments;

            await services.removeComment(comments[0]._id);
            const value = await services.getAllCommentsFromPost(post);
            expect(value.length).to.equal(1);
        });

        it('should return nothing', async function() {
            comments = generateComments(1, 1).comments;

            await services.removeComment(comments[0]._id);
            const value = await services.getAllCommentsFromPost(post);
            expect(value.length).to.equal(0);
        });
    });

    describe('removeAllCommentsFromPost', function() {

        it('should return nothing', async function() {
            comments = generateComments(10, 4).comments;

            await services.removeAllCommentsFromPost(post);
            const value = await services.getAllCommentsFromPost(post);
            expect(value.length).to.equal(0);
        });
    });

    describe('updateComment', function() {

        it('should show content = \'abc\'', async function() {
            comments = generateComments(10, 10).comments;

            await services.updateComment(comments[0]._id, 'abc');
            const value = await services.getComment(comments[0]._id);
            expect(value[0].content).to.equal('abc');
        });

        it('should show content = \' \'', async function() {
            comments = [];

            await services.createComment(new mongoose.mongo.ObjectID, 'abc', '0');
            await services.updateComment(comments[0]._id, ' ');
            const value = await services.getComment(comments[0]._id);
            expect(value[0].content).to.equal(' ');
        });
    });
});
