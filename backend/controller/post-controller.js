const mongoose = require("mongoose");
const postService = require("../service/post-service");
const subscribeService = require("../service/subscriber-service");
const userService = require("../service/user-service");
const likeService = require("../service/likes-service");
const Result = require("../util/Result");

const createPost = async (req, res) => {
  const { content, user_id } = req.body;
  console.log(user_id, content);

  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    return res.json(Result.invalidUserId());
  }

  try {
    const postResult = await postService.createPost(user_id, content);
    const subscribeResult = await subscribeService.notifyAudiences(
      user_id,
      postResult._id,
      content
    );
    res.json(Result.success([postResult, subscribeResult]));
  } catch (err) {
    res.json(Result.fail(err));
  }
};

const updatePostContent = async (req, res) => {
  const { content, post_id } = req.body;
  console.log(post_id, content);

  if (!mongoose.Types.ObjectId.isValid(post_id)) {
    return res.json(Result.invalidPostId());
  }

  await postService
    .updateContent(post_id, content)
    .then((result) => {
      res.json(Result.success(result));
    })
    .catch((err) => {
      res.json(Result.fail(err));
    });
};

const getPostByID = async (req, res) => {
  const { post_id } = req.query;
  console.log(post_id);

  if (!mongoose.Types.ObjectId.isValid(post_id)) {
    return res.json(Result.invalidPostId());
  }

  try {
    const post = await postService.getPostByID(post_id);
    const result = await getPostsInfo([post]);
    res.json(Result.success(result));
  } catch (err) {
    res.json(Result.fail(err));
  }
};

// it must be done by the user who owns the post
const removePostByID = async (req, res) => {
  const { post_id } = req.query;
  console.log(post_id);

  if (!mongoose.Types.ObjectId.isValid(post_id)) {
    return res.json(Result.invalidPostId());
  }

  await postService
    .removePostByID(post_id)
    .then((result) => {
      res.json(Result.success(result));
    })
    .catch((err) => {
      res.json(Result.fail(err));
    });
};

const getRecentPost = async (req, res) => {
  try {
    const posts = await postService.getAllPosts();
    const result = await getPostsInfo(posts);

    res.json(Result.success(result));
  } catch (err) {
    res.json(Result.fail(err));
  }
};

const getAllPostsFromUser = async (req, res) => {
  const { user_id } = req.query;

  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    return res.json(Result.invalidUserId());
  }

  try {
    const posts = await postService.getAllPostsFromUser(user_id);
    const result = await getPostsInfo(posts);
    res.json(Result.success(result));
  } catch (err) {
    res.json(Result.fail(err));
  }
};

async function getPostsInfo(posts) {
  const result = [];
  const userPromises = [];
  const likePromises = [];

  for (let i = 0; i < posts.length; i++) {
    let post = posts[i];

    userPromises.push(userService.getUserInfo(post.user_id));
    likePromises.push(likeService.getNumLikes(post._id));
  }

  const users = await Promise.all(userPromises);
  const likes = await Promise.all(likePromises);

  for (let i = 0; i < posts.length; i+=1) {
    let post = posts[i];
      
    result.push({
        post, 
        username: users[i].username,
        affiliation: users[i].affiliation,
        profile_photo: users[i].profile_photo,
        numberLikes: likes[i],
      });
  }

  return result;
}

//get posts from subscribed channels
const getSubscribedPosts = async (req, res) => {
    const { user_id, start, size } = req.query;

    if(!mongoose.Types.ObjectId.isValid(user_id)){
        return res.json(Result.invalidUserId());
    }

    try{
        const subscribes = await subscribeService.getUserFollowingPage(user_id, start, size);
        const creators = [...new Set(subscribes.map( subscribe => subscribe.creator_id ))];
        let all_posts = [];
        let all_result = [];

        for(let creator of creators){
            const posts = await postService.getAllPostsFromUser(creator);
            const result = await getPostsInfo(posts);
            all_posts.extend(posts);
            all_result.extend(result);
        }
        
        res.json(Result.success(all_result));
    }catch(err){
        res.json(Result.fail(err));
    }
}

Array.prototype.extend = function (array) {
    array.forEach(item => this.push(item));
}

module.exports = {
    createPost, 
    updatePostContent,
    getPostByID,
    removePostByID, 
    getRecentPost, 
    getAllPostsFromUser,
    getSubscribedPosts,
}
