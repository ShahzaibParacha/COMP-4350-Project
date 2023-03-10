const Post = require('../schema/post-schema');
const mongoose = require('mongoose');

//get all posts
//returns the documents
const getAllPosts = async () => {
    return await Post.find(); 
}

//get a post by id
//returns the found document
const getPostByID = async (id) => {
    return await Post.findByID(id);
}

//get all posts of a user
//returns the documents
const getAllPostsFromUser = async (user_id) => {
    return await Post.find({user_id});
}

 //create a new post
 //returns a promise
 const createPost = async (user_id, content, image) => {
    return await Post.create({user_id, content, image});
 }

 //remove a post by id
 //returns the found document
 const removePostByID = async (id) => {
    return await Post.findOneAndDelete({_id: id});
 }

 //remove all the posts of a user
 //returns an object with property deletedCount, which is the number of documents deleted
 const removeAllPostsFromUser = async (user_id) => {
    return await Post.deleteMany({user_id});
 }

 module.exports = {
    getAllPosts, 
    getPostByID,
    getAllPostsFromUser,
    createPost,
    removePostByID,
    removeAllPostsFromUser,
 };