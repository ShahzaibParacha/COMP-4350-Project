const crypto = require('crypto');

const bucketName = 'comp4350';

const randomImageName = (bytes = 32) => {
	return crypto.randomBytes(bytes).toString('hex');
};

function paramsForUpload(req) {
	const name = randomImageName();
	const buffer = req.file.buffer;
	const mimetype = req.file.mimetype;
	
	return {
		Bucket: bucketName,
		Key: name,
		Body: buffer,
		ContentType: mimetype
	};
};

function paramsForDelete(req) {
	const tokens = req.body.image.split('/');
	const key = tokens[tokens.length - 1];

	return {
		Bucket: bucketName,
		Key: key
	};
};

module.exports = { paramsForUpload, paramsForDelete };