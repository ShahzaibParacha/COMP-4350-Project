const  {
    getAllPosts, 
    getPageOfPosts,
    getPostByID,
    getAllPostsFromUser,
    createPost,
    removePostByID,
    removeAllPostsFromUser,
    updateContent,
    countPostsFromUser,
 } = require('../model/post-model');

 class PostServices {
    getAllPosts() { return getAllPosts(); }
    getPageOfPosts(page_number, page_size) { return getPageOfPosts(page_number, page_size); }
    getPostByID(id) { return getPostByID(id); }
    getAllPostsFromUser(user_id) { return getAllPostsFromUser(user_id); }
    createPost(user_id, content, image) { return createPost(user_id, content, image); }
    removePostByID(id) { return removePostByID(id); }
    removeAllPostsFromUser(user_id) { return removeAllPostsFromUser(user_id); }
    updateContent(id, content) { return updateContent(id, content); }
    countPostsFromUser(user_id) { return countPostsFromUser(user_id); }
 }

 module.exports = PostServices;