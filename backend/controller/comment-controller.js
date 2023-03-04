const {
    createComment: createCommentService,
    getAllCommentsFromPost: getAllCommentsFromPostService
    } = require("../service/comment-service")
const mongoose = require("mongoose")
const Result = require("../util/Result")
const getUserInfo  = require("../service/user-service").getUserInfo;

const getCommentsFromPost = (req, res) => {
    const post_id = req.query.post_id;
    console.log(post_id);

    if (!mongoose.Types.ObjectId.isValid(post_id)) {
         return res.json(Result.invalidPostId());
    }

    getAllCommentsFromPostService(post_id)
        .then((comments) => {
            let promises = [];
            let result = [];

            //retrieve the profile of the users who wrote the comments
            for (let i = 0; i < comments.length; i++) {
                promises.push(getUserInfo(comments[i].user_id));
            }
        
            Promise.all(promises).then((users) => {
                for (let i = 0; i < comments.length; i++) {
                    //return the username of the users who wrote the comments too
                    result.push({username: users[i].username, user_id: comments[i].user_id, post_id: comments[i].post_id, content: comments[i].content, comment_date: comments[i].comment_date })
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
    const {content, post_id, user_id} = req.body;

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