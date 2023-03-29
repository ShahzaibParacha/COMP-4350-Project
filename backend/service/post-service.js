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
	getRecommendedPosts: getRecommendedPostsModel
} = require('../model/post-model');
const likeService = require('./likes-service');

const getAllPosts = () => { return getAllPostsModel(); };
const getPageOfPosts = (page_number, page_size) => { return getPageOfPostsModel(page_number, page_size); };
const getPostByID = (id) => { return getPostByIDModel(id); };
const getAllPostsFromUser = (user_id) => { return getAllPostsFromUserModel(user_id); };
const createPost = (user_id, content, createKeywords) => { return createPostModel(user_id, content, createKeywords); };
const removePostByID = (id) => { return removePostByIDModel(id); };
const removeAllPostsFromUser = (user_id) => { return removeAllPostsFromUserModel(user_id); };
const updateContent = (id, content, createKeywords) => { return updateContentModel(id, content, createKeywords); };
const countPostsFromUser = (user_id) => { return countPostsFromUserModel(user_id); };

//get a list of recommendated posts based on the liked information of the user
const getRecommendedPosts = async (user_id) => {
	const similarPostsPromises = [];

	const likedPosts = await likeService.getRecentUserLikedPosts(user_id);
	for (let i = 0; i < likedPosts.length; i++) {
		const post = await getPostByID(likedPosts[i].post_id);
		if( post !== null && post._id != null && post.user_id != user_id ){
			similarPostsPromises.push( getRecommendedPostsModel(post._id) );
		}
	}
	const similarPosts = await Promise.all(similarPostsPromises);
	const similarPostsFlat = similarPosts.flat(1);
	//console.log(similarPostsFlat);
	return similarPostsFlat;
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
	getRecommendedPosts
};
