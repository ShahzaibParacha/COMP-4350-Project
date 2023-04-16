const mongoose = require('mongoose');
const Subscriber = require('../../schema/subscriber-schema');
const expect = require('chai').expect;

describe('Subscriber schema', function () {
	it('should accept since all required subscriber information are given', function () {
		const subscriber = new Subscriber({
			_id: new mongoose.mongo.ObjectID(),
			audience_id: new mongoose.mongo.ObjectID(),
			creator_id: new mongoose.mongo.ObjectID()
		});

		subscriber.validate((err) => {
			expect(err).to.not.exist;
		});
	});

	it('should accept since audience_id is invalid', function () {
		const subscriber = new Subscriber({
			_id: new mongoose.mongo.ObjectID(),
			audience_id: null,
			creator_id: new mongoose.mongo.ObjectID()
		});

		subscriber.validate((err) => {
			expect(err).to.exist;
		});
	});

	it('should accept since creator_id is invalid', function () {
		const subscriber = new Subscriber({
			_id: new mongoose.mongo.ObjectID(),
			audience_id: new mongoose.mongo.ObjectID(),
			creator_id: null
		});

		subscriber.validate((err) => {
			expect(err).to.exist;
		});
	});
});
