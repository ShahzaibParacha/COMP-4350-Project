const {
	getNumLikes: getNumLikesModel,
	getRecentUserLikedPosts: getRecentUserLikedPostsModel,
	userLikedPost: userLikedPostModel,
	likePost: likePostModel,
	unlikePost: unlikePostModel
} = require('../model/likes-model');

const getNumLikes = (post_id) => { return getNumLikesModel(post_id); };

// get the recent liked post by the user
const getRecentUserLikedPosts = (user_id) => { return getRecentUserLikedPostsModel(user_id); };

const userLikedPost = (post_id, user_id) => { return userLikedPostModel(post_id, user_id); };

const likePost = async (post_id, user_id) => {
	if (!(await userLikedPost(post_id, user_id))) {
		return likePostModel(post_id, user_id);
	}
};

const unlikePost = (post_id, user_id) => { return unlikePostModel(post_id, user_id); };

module.exports = {
	getNumLikes,
	getRecentUserLikedPosts,
	userLikedPost,
	likePost,
	unlikePost
};
