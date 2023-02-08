const Post = require('../schema/post-schema');

//get all posts
//returns the documents
const getAllPosts = async () => {
    return await Post.find({}); 
}

//get a post by id
//returns the found document
const getPostByID = async (id) => {
    return await Post.findOne({_id: id});
}

//get all posts of a user
//returns the documents
const getAllPostsFromUser = async (user_id) => {
    return await Post.find({user_id});
}

//count the number of posts made by a user
const countPostsFromUser = async (user_id) => {
   return await Post.countDocuments({user_id});
}

 //create a new post
 //returns the new document
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

 //update the content of a post
 //returns the object updated
 const updateContent = async (id, content) => {
   return await Post.findOneAndUpdate({_id: id}, {content});
 }

 module.exports = {
    getAllPosts, 
    getPostByID,
    getAllPostsFromUser,
    createPost,
    removePostByID,
    removeAllPostsFromUser,
    updateContent,
    countPostsFromUser,
 };