const mongoose = require('mongoose');
const User = require('../../schema/user-schema');
const expect = require('chai').expect;

describe('User schema', function () {
	it('should accept since all required user information are given', function () {
		let user = new User({
			_id: new mongoose.mongo.ObjectID(),
			username: 'this is username',
			password: 'this is password',
			email: 'this is an email',
			profile_photo: '/sample_profile.jpg'
		});

		user.validate(function (err) {
			expect(err).to.not.exist;
		});
	});

	it('should not accept since the username cannot over 30 characters', function () {
		let user = new User({
			_id: new mongoose.mongo.ObjectID(),
			username: 'this is a very very very very long username lkjnlhl;kjkljlkjkl;jlkj;j;',
			password: 'this is password',
			email: 'this is an email',
			profile_photo: '/sample_profile.jpg'
		});

		expect(user.validateSync().errors.username).to.exist;
	});

	it('should not accept since the username must over 3 characters', function () {
		let user = new User({
			_id: new mongoose.mongo.ObjectID(),
			username: 'ab',
			password: 'this is password',
			email: 'this is an email',
			profile_photo: '/sample_profile.jpg'
		});
		expect(user.validateSync().errors.username).to.exist;
	});

	it('should not accept since email cannot over 50 characters', () => {
		let user = new User({
			_id: new mongoose.mongo.ObjectID(),
			username: 'Wayne',
			password: 'this is password',
			email: '123456789012345678901234567890123456789012345678901',
			profile_photo: '/sample_profile.jpg'
		});
		expect(user.validateSync().errors.email).to.exist;
	});

	it('should not accept since email cannot over 5 characters', () => {
		let user = new User({
			_id: new mongoose.mongo.ObjectID(),
			username: 'Wayne',
			password: 'this is password',
			email: 'emai',
			profile_photo: '/sample_profile.jpg'
		});
		expect(user.validateSync().errors.email).to.exist;
	});

	it('should not accept since password cannot over 20 characters', () => {
		let user = new User({
			_id: new mongoose.mongo.ObjectID(),
			username: 'Wayne',
			password: '123456789012345678901',
			email: 'this is a email',
			profile_photo: '/sample_profile.jpg'
		});
		expect(user.validateSync().errors.password).to.exist;
	});

	it('should not accept since password must over 8 characters', () => {
		let user = new User({
			_id: new mongoose.mongo.ObjectID(),
			username: 'Wayne',
			password: 'passwor',
			email: '1234567',
			profile_photo: '/sample_profile.jpg'
		});
		expect(user.validateSync().errors.password).to.exist;
	});
});
