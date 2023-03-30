const {
	S3Client,
	PutObjectCommand,
	DeleteObjectCommand
} = require('@aws-sdk/client-s3');
const Params = require('../util/Params');
const Result = require('../util/Result');
require('dotenv').config;

const s3 = new S3Client({
	region: 'us-east-2',
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
	}
});

const deleteImage = async (req, res) => {
	const params = Params.paramsForDelete(req);

	const command = new DeleteObjectCommand(params);
	try {
		await s3.send(command);
		res.json(Result.success('Successfully deleted the image'));
	}
	catch (err) {
		res.json(Result.fail('Failed to delete image'));
	}
};

const uploadImage = async (req, res) => {
	const params = Params.paramsForUpload(req);

	const command = new PutObjectCommand(params);
	try
	{
		await s3.send(command);
		res.json(Result.success({
			imageUrl: `https://comp4350.s3.us-east-2.amazonaws.com/${params.Key}`
			})
		);
	}
	catch (err) {
		res.json(Result.fail('Failed to upload image'));
	}
};

module.exports = { uploadImage, deleteImage };
