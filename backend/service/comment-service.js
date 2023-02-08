const   {
        createComment,
        getAllCommentsFromPost,
        getComment,
        removeComment,
        removeAllCommentsFromPost,
        updateComment
        } = require('../model/comment-model');

//the Comment service class 
 class CommentServices {
    createComment(post_id, user_id, content, comment_date) { return createComment(post_id, user_id, content, comment_date); }
    getAllCommentsFromPost(post_id) { return getAllCommentsFromPost(post_id); }
    getComment(id) { return getComment(id); }
    removeComment(id) { return removeComment(id); }
    removeAllCommentsFromPost(post_id) { return removeAllCommentsFromPost(post_id); }
    updateComment(id, content) { return updateComment(id, content); }
 }

 module.exports = CommentServices;
