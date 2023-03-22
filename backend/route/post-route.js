const postController = require('../controller/post-controller');
const router = require('express').Router();

router.post('/create', postController.createPost);
router.post('/update', postController.updatePostContent);
router.delete('/update', postController.removePostByID);
router.get('/getPostByID', postController.getPostByID);
router.get('/getRecentPosts', postController.getRecentPost);
router.get('/getUserPosts', postController.getAllPostsFromUser);
router.get('/getSubscribedPosts', postController.getSubscribedPosts);

module.exports = router;
