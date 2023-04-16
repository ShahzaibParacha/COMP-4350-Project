const {
	createComment: createCommentModel,
	getAllCommentsFromPost: getAllCommentsFromPostModel,
	getComment: getCommentModel,
	removeComment: removeCommentModel,
	removeAllCommentsFromPost: removeAllCommentsFromPostModel,
	updateComment: updateCommentModel
} = require('../model/comment-model');

// the Comment service class
const createComment = (post_id, user_id, content, comment_date) => { return createCommentModel(post_id, user_id, content, comment_date); };
const getAllCommentsFromPost = (post_id) => { return getAllCommentsFromPostModel(post_id); };
const getComment = (id) => { return getCommentModel(id); };
const removeComment = (id) => { return removeCommentModel(id); };
const removeAllCommentsFromPost = (post_id) => { return removeAllCommentsFromPostModel(post_id); };
const updateComment = (id, content) => { return updateCommentModel(id, content); };

module.exports = {
	createComment,
	getAllCommentsFromPost,
	getComment,
	removeComment,
	removeAllCommentsFromPost,
	updateComment
};
