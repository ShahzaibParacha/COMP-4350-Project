const {
	S3Client,
	PutObjectCommand,
	DeleteObjectCommand
} = require('@aws-sdk/client-s3');
const crypto = require('crypto');
const Result = require('../util/Result');
require('dotenv').config;

const s3 = new S3Client({
	region: 'us-east-2',
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
	}
});
const bucketName = 'comp4350';

const randomImageName = (bytes = 32) => {
	return crypto.randomBytes(bytes).toString('hex');
};

const deleteImage = (req, res) => {
	const tokens = req.body.image.split('/');
	const key = tokens[tokens.length - 1];

	const params = {
		Bucket: bucketName,
		Key: key
	};

	const command = new DeleteObjectCommand(params);
	s3.send(command)
		.then(() => {
			res.json(Result.success('Successfully deleted the image'));
		})
		.catch(() => {
			res.json(Result.fail('Failed to delete image'));
		});
};

const uploadImage = (req, res) => {
	const name = randomImageName();
	const buffer = req.file.buffer;
	const mimetype = req.file.mimetype;

	const params = {
		Bucket: bucketName,
		Key: name,
		Body: buffer,
		ContentType: mimetype
	};

	const command = new PutObjectCommand(params);
	s3.send(command)
		.then(() => {
			res.json(
				Result.success({
					imageUrl: `https://comp4350.s3.us-east-2.amazonaws.com/${name}`
				})
			);
		})
		.catch(() => {
			res.json(Result.fail('Failed to upload image'));
		});
};

module.exports = { uploadImage, deleteImage };
