const { getNumLikes, likePost, unlikePost, userLikedPost, getRecentUserLikedPosts } = require('../controller/like-controller.js');
const router = require('express').Router();

router.use((req, res, next) => {
	console.log('an request come to user route');
	next();
});

router.get('/getNumLikes', getNumLikes);

router.post('/likePost', likePost);

router.post('/unlikePost', unlikePost);

router.get('/userLikedPost', userLikedPost);

router.get('/getRecentUserLikedPosts', getRecentUserLikedPosts);

module.exports = router;
