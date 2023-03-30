const postController = require('../controller/post-controller');
const router = require('express').Router();

router.post('/create', postController.createPost);
router.post('/update', postController.updatePostContent);
router.post('/createLoadTest', postController.createPostLoadTest);
router.post('/updateLoadTest', postController.updatePostContentLoadTest);
router.delete('/update', postController.removePostByID);
router.get('/getPostByID', postController.getPostByID);
router.get('/getRecentPosts', postController.getRecentPost);
router.get('/getUserPosts', postController.getAllPostsFromUser);
router.get('/getSubscribedPosts', postController.getSubscribedPosts);
router.get('/getRecommendedPosts', postController.getRecommendedPosts);

module.exports = router;
