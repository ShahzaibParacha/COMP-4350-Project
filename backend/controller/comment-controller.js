const mongoose = require("mongoose");
const {
  createComment: createCommentService,
  getAllCommentsFromPost: getAllCommentsFromPostService,
} = require("../service/comment-service");
const Result = require("../util/Result");
const { getUserInfo } = require("../service/user-service");

const getCommentsFromPost = (req, res) => {
  const { post_id } = req.query;

  if (!mongoose.Types.ObjectId.isValid(post_id)) {
    return res.json(Result.invalidPostId());
  }

  getAllCommentsFromPostService(post_id)
    .then((comments) => {
      const promises = [];
      const result = [];

      // retrieve the profile of the users who wrote the comments
      for (let i = 0; i < comments.length; i++) {
        promises.push(getUserInfo(comments[i].user_id));
      }

      Promise.all(promises)
        .then((users) => {
          for (let i = 0; i < comments.length; i++) {
            // return the username of the users who wrote the comments too as well as the profile photo
            result.push({
              username: users[i].username,
              user_id: comments[i].user_id,
              post_id: comments[i].post_id,
              content: comments[i].content,
              comment_date: comments[i].comment_date,
              profile_photo: users[i].profile_photo,
            });
          }
          res.json(Result.success(result));
        })
        .catch((err) => {
          res.json(Result.fail(err));
        });
    })
    .catch((err) => {
      res.json(Result.fail(err));
    });
};

const createComment = (req, res) => {
  const { content, post_id, user_id } = req.body;

  console.log(post_id, user_id, content);

  if (!mongoose.Types.ObjectId.isValid(post_id)) {
    return res.json(Result.invalidPostId());
  }
  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    return res.json(Result.invalidUserId());
  }

  createCommentService(post_id, user_id, content, Date.now())
    .then((result) => {
      res.json(Result.success(result));
    })
    .catch((err) => {
      res.json(Result.fail(err));
    });
};

module.exports = { getCommentsFromPost, createComment };
