const { uploadImage, deleteImage } = require("../controller/aws-controller")
const router = require("express").Router();
const multer = require("multer");

const storage = multer.memoryStorage(); // store in memory and not on disk
const upload = multer({storage: storage});

// will intercept the request and store the image sent in req.file
router.post('/upload_image', upload.single('image'), uploadImage);

router.post('/delete_image', deleteImage)

module.exports = router;