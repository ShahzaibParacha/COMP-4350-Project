const mongoose = require('mongoose');
const Comment = require('../../schema/comment-schema');
const expect = require('chai').expect;

describe('Comment schema', function () {
    it('should not accept if nothing is provided', function () {
        let comment = new Comment();

        comment.validate(function (err) {
            expect(err.errors.post_id).to.exist;
        });
    });

    it('should not accept if only post_id is provided', function () {
        let comment = new Comment({post_id: new mongoose.mongo.ObjectID()});

        comment.validate(function (err) {
            expect(err.errors.user_id).to.exist;
        });
    });

    it('should not accept if only user_id is provided', function () {
        let comment = new Comment({user_id: new mongoose.mongo.ObjectID()});

        comment.validate(function (err) {
            expect(err.errors.post_id).to.exist;
        });
    });

    it('should accept since both post_id and user_id are provided', function () {
        let comment = new Comment({ user_id: new mongoose.mongo.ObjectID(), 
                                    post_id: new mongoose.mongo.ObjectID() });

        comment.validate(function (err) {
            expect(err).to.not.exist;
        });
    });

    it('should not accept since comment_date should be a date', function () {
        let comment = new Comment({ user_id: new mongoose.mongo.ObjectID(),
                                    post_id: new mongoose.mongo.ObjectID(),
                                    comment_date: 'some faulty value' });

        comment.validate(function (err) {
            expect(err).to.exist;
        });
    });

    it('should say that comment content = \' \'', function() {
        let comment = new Comment({ post_id: new mongoose.mongo.ObjectID(),
                                    user_id: new mongoose.mongo.ObjectID() });

        expect(comment.content).to.equal(' ');
    });

});