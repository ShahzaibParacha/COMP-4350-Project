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

const getAllPosts = () => { return getAllPostsModel(); };
const getPageOfPosts = (page_number, page_size) => { return getPageOfPostsModel(page_number, page_size); };
const getPostByID = (id) => { return getPostByIDModel(id); };
const getAllPostsFromUser = (user_id) => { return getAllPostsFromUserModel(user_id); };
const createPost = (user_id, content, title, image) => { return createPostModel(user_id, content, title, image); };
const removePostByID = (id) => { return removePostByIDModel(id); };
const removeAllPostsFromUser = (user_id) => { return removeAllPostsFromUserModel(user_id); };
const updateContent = (id, content) => { return updateContentModel(id, content); };
const countPostsFromUser = (user_id) => { return countPostsFromUserModel(user_id); };
const getRecommendatedPosts = (post_id) => {return getRecommendatedPostsModel(post_id);};

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
