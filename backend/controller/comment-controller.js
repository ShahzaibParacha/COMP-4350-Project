const commentService = require("../service/comment-service")
const Result = require("../util/Result")

const getCommentsFromPost = (req, res) => {
    const post_id = req.query.post_id;
    console.log(post_id);

    if (!mongoose.Types.ObjectId.isValid(post_id)) {
         return res.json(Result.fail('Cannot find comments by given post id'));
    }

    commentService.getAllCommentsFromPost(post_id)
        .then((comments) => {
            res.json(Result.success(comments));
        })
        .catch((err) => {
            res.json(Result.fail(err));
        });
};

const createComment = (req, res) => {
    const post_id = req.query.post_id;
    const user_id = req.query.user_id;
    const {content} = req.body;

    console.log(post_id, user_id, content);

    if (!mongoose.Types.ObjectId.isValid(post_id)) {
        return res.json(Result.fail('Cannot create comment for invalid post'));
    }
    if (!mongoose.Types.ObjectId.isValid(user_id)) {
        return res.json(Result.fail('Cannot create comment since the user is invalid'));
    }

    commentService.createComment(post_id, user_id, content, Date.now())
        .then((result) => {
            res.json(Result.success(result));
        })
        .catch((err) => {
            res.json(Result.fail(err));
        });
};

module.exports = { getCommentsFromPost, createComment };