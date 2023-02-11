const postService = require("../service/post-service")
const Result = require("../util/Result")
const mongoose = require("mongoose")

const numberPages = 1 //default number of pages to show
const numberPostsPerPage = 10 //default number of posts to present on each page

const createPost = async (req, res) => {
    const{content, user_id} = req.body
    console.log(user_id, content)

    if(!mongoose.Types.ObjectId.isValid(user_id)){
        return res.json(Result.invalidUserId())
    }

    await postService.createPost(user_id, content)
    .then((result) => {
        res.json(Result.success(result))
    })
    .catch((err) => {
        res.json(Result.fail(err))
    })
}

const updatePostContent = async (req, res) => {
    const{content, post_id} = req.body
    console.log(post_id, content)

    if(!mongoose.Types.ObjectId.isValid(post_id)){
        return res.json(Result.invalidPostId())
    }

    await postService.updateContent(post_id, content)
    .then((result) => {
        res.json(Result.success(result))
    })
    .catch((err) => {
        res.json(Result.fail(err))
    })
}

//it must be done by the user who owns the post
const removePostByID = async (req, res) => {
    const { post_id } = req.body
    console.log(post_id)

    if(!mongoose.Types.ObjectId.isValid(post_id)){
        return res.json(Result.invalidPostId())
    }

    await postService.removePostByID(post_id)
    .then((result) => {
        res.json(Result.success(result))
    })
    .catch((err) => {
        res.json(Result.fail(err))
    })
}

const getRecentPost = async (req, res) => {
    const page = parseInt(req.query.page) || numberPages
    const postsPerPage = parseInt(req.query.perPage) || numberPostsPerPage
    const startInd = (page - 1) * postsPerPage

    await postService.getAllPosts()
    .sort({post_date: -1})
    .skip(startInd)
    .limit(numberPosts)
    .then((result) => {
        res.json(Result.success(result))
    })
    .catch((err) => {
        res.json(Result.fail(err))
    })
}

const getAllPostsFromUser = async (req, res) => {
    const { user_id } = req.body
    console.log(user_id)

    const page = parseInt(req.query.page) || numberPages
    const postsPerPage = parseInt(req.query.perPage) || numberPostsPerPage
    const startInd = (page - 1) * postsPerPage

    if(!mongoose.Types.ObjectId.isValid(user_id)){
        return res.json(Result.invalidUserId())
    }
    
    await postService.getAllPostsFromUser()
    .sort({post_date: -1})
    .skip(startInd)
    .limit(numberPosts)
    .then((result) => {
        res.json(Result.success(result))
    })
    .catch((err) => {
        res.json(Result.fail(err))
    })
}

module.exports = {
    createPost, 
    updatePostContent, 
    removePostByID, 
    getRecentPost, 
    getAllPostsFromUser
}
