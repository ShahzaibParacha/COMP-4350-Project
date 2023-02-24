const {
    getNumLikes: getNumLikesFromService,
    userLikedPost: userLikedPostFromService,
    likePost: likePostFromService,
    unlikePost: unlikePostFromService,
    } = require("../service/likes-service")
const mongoose = require("mongoose")
const Result = require("../util/Result")

const getNumLikes = (req, res) => {
    const { post_id } = req.body;
    console.log(post_id);

    if (!mongoose.Types.ObjectId.isValid(post_id)) {
         return res.json(Result.invalidPostId());
    }

    getNumLikesFromService(post_id)
    .then(num => {
        res.json(Result.success(num));
    })
    .catch(err => {
        res.json(Result.fail(err));
    })
}

const userLikedPost = (req, res) => {
    const { user_id, post_id } = req.body;
    console.log(user_id, post_id);

    if (!mongoose.Types.ObjectId.isValid(post_id)) {
         return res.json(Result.invalidPostId());
    }
    if (!mongoose.Types.ObjectId.isValid(user_id)) {
        return res.json(Result.invalidUserId());
    }

    userLikedPostFromService(post_id, user_id)
    .then(num => {
        res.json(Result.success(num));
    })
    .catch(err => {
        res.json(Result.fail(err));
    })
}

const unlikePost = (req, res) => {
    const { user_id, post_id } = req.body;
    console.log(user_id, post_id);

    if (!mongoose.Types.ObjectId.isValid(post_id)) {
         return res.json(Result.invalidPostId());
    }
    if (!mongoose.Types.ObjectId.isValid(user_id)) {
        return res.json(Result.invalidUserId());
    }

    unlikePostFromService(post_id, user_id)
    .then(num => {
        res.json(Result.success(num));
    })
    .catch(err => {
        res.json(Result.fail(err));
    })
}

const likePost = (req, res) => {
    const { user_id, post_id } = req.body;
    console.log(user_id, post_id);

    if (!mongoose.Types.ObjectId.isValid(post_id)) {
         return res.json(Result.invalidPostId());
    }
    if (!mongoose.Types.ObjectId.isValid(user_id)) {
        return res.json(Result.invalidUserId());
    }

    likePostFromService(post_id, user_id)
    .then(num => {
        res.json(Result.success(num));
    })
    .catch(err => {
        res.json(Result.fail(err));
    })
}

module.exports = { getNumLikes, userLikedPost, likePost, unlikePost };