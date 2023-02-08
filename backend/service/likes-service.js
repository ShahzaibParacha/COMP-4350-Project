const  {
    getNumLikes,
    userLikedPost,
    likePost,
    unlikePost,
 } = require('../model/likes-model');

 class LikeServices {
    getNumLikes(post_id) { return getNumLikes(post_id); }
    userLikedPost(post_id, user_id) { return userLikedPost(post_id, user_id); }
    async likePost(post_id, user_id) { 
      if (!(await userLikedPost(post_id, user_id))) {
         return likePost(post_id, user_id);  
      }
   }
    unlikePost(post_id, user_id) { return unlikePost(post_id, user_id); }
 }

 module.exports = LikeServices;