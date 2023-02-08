const Like = require('../schema/likes-schema');

//get the number of likes of a post
const getNumLikes = async (post_id) => {
    return await Like.countDocuments({post_id});
}

//determine if the user has liked a post
const userLikedPost = async (post_id, user_id) => {
    return await (Like.countDocuments({post_id, user_id}) > 0);
}

//like a post
const likePost = async (post_id, user_id) => {
    return await Like.create({post_id, user_id});
}

//unlike a post
const unlikePost = async (post_id, user_id) => {
    return await Like.findOneAndDelete({post_id, user_id});
}

 module.exports = {
    getNumLikes,
    userLikedPost,
    likePost,
    unlikePost,
 };