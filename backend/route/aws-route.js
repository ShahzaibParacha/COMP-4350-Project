const { uploadImage, deleteImage } = require('../controller/aws-controller');
const router = require('express').Router();
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload_image', upload.single('image'), uploadImage);

router.post('/delete_image', deleteImage);

module.exports = router;
