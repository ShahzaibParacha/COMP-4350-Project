const mongoose = require('mongoose');
const User = require('../schema/user-schema');
const Post = require("../schema/post-schema");
const expect = require('chai').expect;

describe('User schema', function () {
    it('should not accept if user_id is not given', function () {
        let user = new User()
        User.validate(user)
    });

    it('should accept since user_id is given', function () {
        let post = new Post({ user_id: new mongoose.mongo.ObjectID() });

        post.validate(function (err) {
            expect(err).to.not.exist;
        });
    });

    it('should not accept since post_date should be a date', function () {
        let post = new Post({ user_id: new mongoose.mongo.ObjectID, post_date: 'some faulty value' });

        post.validate(function (err) {
            expect(err).to.exist;
        });
    });

    it('should say that content = \' \'', function() {
        let post = new Post({ user_id: new mongoose.mongo.ObjectID });

        expect(post.content).to.equal(' ');
    });
}