const  {
    getAllPosts, 
    getPostByID,
    getAllPostsFromUser,
    createPost,
    removePostByID,
    removeAllPostsFromUser,
    updateLikes,
    updateContent,
 } = require('../model/post-model');

 class PostServices {
    getAllPosts() { return getAllPosts(); }
    getPostByID(id) { return getPostByID(id); }
    getAllPostsFromUser(user_id) { return getAllPostsFromUser(user_id); }
    createPost(user_id, content, image) { return createPost(user_id, content, image); }
    removePostByID(id) { return removePostByID(id); }
    removeAllPostsFromUser(user_id) { return removeAllPostsFromUser(user_id); }
    updateLikes(id, likes) {
        if (likes >= 0) {
             return updateLikes(id, likes);
        }
    }
    updateContent(id, content) { return updateContent(id, content); }
 }

 module.exports = PostServices;