const mongoose = require('mongoose');
const Like = require('../schema/likes-schema');
const expect = require('chai').expect;

describe('Like schema', function () {
    it('should not accept if user_id is not given', function () {
        let like = new Like({post_id: new mongoose.mongo.ObjectID});

        like.validate(function (err) {
            expect(err.errors).to.exist;
        });
    });

    it('should not accept if post_id is not given', function () {
        let like = new Like({user_id: new mongoose.mongo.ObjectID});

        like.validate(function (err) {
            expect(err).to.exist;
        });
    });

    it('should accept if both user_id and post-id are given', function() {
        let like = new Like({user_id: new mongoose.mongo.ObjectID, post_id: new mongoose.mongo.ObjectID});

        like.validate(function (err) {
            expect(err).to.not.exist;
        });
    });
});