const mongoose = require('mongoose');
const Post = require('./post-schema');
const expect = require('chai').expect;

describe('Post schema', function () {
    it('should not accept if user_id is not given', function (done) {
        let post = new Post();

        post.validate(function (err) {
            expect(err.errors.user_id).to.exist;
            done();
        });
    });

    it('should accept since user_id is given', function (done) {
        let post = new Post({ user_id: new mongoose.mongo.ObjectID() });

        post.validate(function (err) {
            expect(err).to.not.exist;
            done();
        });
    });

    it('should not accept since likes should be a number', function (done) {
        let post = new Post({ user_id: new mongoose.mongo.ObjectID, likes: 'some faulty value' });

        post.validate(function (err) {
            expect(err).to.exist;
            done();
        });
    });

    it('should not accept since post_date should be a date', function (done) {
        let post = new Post({ user_id: new mongoose.mongo.ObjectID, post_date: 'some faulty value' });

        post.validate(function (err) {
            expect(err).to.exist;
            done();
        });
    });
});