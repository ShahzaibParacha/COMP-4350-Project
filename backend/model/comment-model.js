const mongoose = require('mongoose');
const Comment = require('../schema/comment-schema');

//create a new comment
const createComment = async (post_id, user_id, content, comment_date) =>{
    return await Comment.create({post_id, user_id, content, comment_date});
}

//get all comments for a specific post
const getAllCommentsFromPost = async (post_id) => {
    return await Comment.find({post_id: post_id}); //.sort({createdAt: -1});
}

//get a single comment by its id
const getComment = async (id) => {
    return await Comment.findById(id);
}

//delete a comment by its id
//return the found document
const removeComment = async (id) =>{
return await Comment.findOneAndDelete(
        {_id: id},
         {useFindAndModify: false}
        );
}

//remove all comments to a post
//return the number of comments removed
const removeAllCommentsFromPost = async (post_id) => {
    return await Comment.deleteMany({post_id});
 }

//update a comment
//return the updated object
const updateComment = async (id, content) => {
    return await Comment.findOneAndUpdate(
        {_id:id},
        {content: content},
         {useFindAndModify: false}
        );
}

module.exports = {
    createComment,
    getAllCommentsFromPost,
    getComment,
    removeComment,
    removeAllCommentsFromPost,
    updateComment
}
