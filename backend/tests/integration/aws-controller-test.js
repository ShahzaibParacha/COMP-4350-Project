const expect = require('chai').expect;
require('dotenv').config();

const sinon = require('sinon');

const Params = require('../../util/Params');
const { uploadImage, deleteImage } = require('../../controller/aws-controller');

describe('AWS controller', function () {
	before(async () => {
        sinon.stub(Params, "paramsForUpload").callsFake((req) => {   
            let toReturn = (!req.err) ?  {
                Bucket: 'comp4350',
                Key: req.key,
                Body: "Hello World",
            } : {
                Bucket: req.err,
                Key: req.key,
                Body: "Should not be this",
            }       

            return toReturn;
        });

        sinon.stub(Params, "paramsForDelete").callsFake((req) => { 
            let toReturn = (!req.err) ?  {
                Bucket: 'comp4350',
                Key: req.key,
            } : {
                Bucket: req.err,
                Key: req.key,
            }       

            return toReturn;
        })
	});

	after(async () => {
        sinon.restore();
	});

	describe('POST request to upload_image', function () {
		it('should upload a text file (content should be "Hello World")', async function () {
            let result, req, res;
            await uploadImage(req = {err: false, key: "sample.txt"}, res = { json: (data) => result = data });
            
            expect(result.code).to.equal(20000);
            expect(result.msg).to.equal('success');
            expect(result.data.imageUrl).to.equal('https://comp4350.s3.us-east-2.amazonaws.com/sample.txt');
		});

        it('should not upload a text file (content should still be "Hello World")', async function () {
            let result, req, res;
            await uploadImage(req = {err: true, key: "sample.txt"}, res = { json: (data) => result = data });

            expect(result.code).to.equal(40000);
		});
	});
    
    describe('POST request to delete_image', function () {
		it('there should not be an error.txt', async function () {
            let result, req, res;

            await uploadImage(req = {err: false, key: 'error.txt'}, res = { json: (data) => result = data});
            await deleteImage(req = {err: false, key: 'error.txt'}, res = { json: (data) => result = data });

            expect(result.code).to.equal(20000);
            expect(result.msg).to.equal("success");
		});

        it('there should be an other_error.txt', async function () {
            let result, req, res;

            await uploadImage(req = {err: false, key: 'other_error.txt'}, res = { json: (data) => result = data});
            await deleteImage(req = {err: true, key: 'other_error.txt'}, res = { json: (data) => result = data });

            expect(result.code).to.equal(40000);
		});
	}); 
});
