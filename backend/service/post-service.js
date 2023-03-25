const {
	getAllPosts: getAllPostsModel,
	getPageOfPosts: getPageOfPostsModel,
	getPostByID: getPostByIDModel,
	getAllPostsFromUser: getAllPostsFromUserModel,
	createPost: createPostModel,
	removePostByID: removePostByIDModel,
	removeAllPostsFromUser: removeAllPostsFromUserModel,
	updateContent: updateContentModel,
	countPostsFromUser: countPostsFromUserModel,
	getRecommendatedPosts: getRecommendatedPostsModel
} = require('../model/post-model');
const likeService = require('./likes-service');

const getAllPosts = () => { return getAllPostsModel(); };
const getPageOfPosts = (page_number, page_size) => { return getPageOfPostsModel(page_number, page_size); };
const getPostByID = (id) => { return getPostByIDModel(id); };
const getAllPostsFromUser = (user_id) => { return getAllPostsFromUserModel(user_id); };
const createPost = (user_id, content, keywords, image) => { return createPostModel(user_id, content, keywords, image); };
const removePostByID = (id) => { return removePostByIDModel(id); };
const removeAllPostsFromUser = (user_id) => { return removeAllPostsFromUserModel(user_id); };
const updateContent = (id, content, keywords) => { return updateContentModel(id, content, keywords); };
const countPostsFromUser = (user_id) => { return countPostsFromUserModel(user_id); };

//get a list of recommendated posts based on the liked information of the user
const getRecommendatedPosts = async (user_id) => {
	const similarPostsPromises = [];

	const likedPosts = await likeService.getRecentUserLikedPosts(user_id);

	for (let i = 0; i < likedPosts.length; i++) {
		let post = likedPosts[i];
		if( post !== null && post.post_id != null ){
			similarPostsPromises.push(getRecommendatedPostsModel(post.post_id));
		}
	}

	const similarPosts = await Promise.all(similarPostsPromises);
	return similarPosts;
};

module.exports = {
	getAllPosts,
	getPageOfPosts,
	getPostByID,
	getAllPostsFromUser,
	createPost,
	removePostByID,
	removeAllPostsFromUser,
	updateContent,
	countPostsFromUser,
	getRecommendatedPosts
};
