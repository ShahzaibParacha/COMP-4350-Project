const express = require("express");
const commentController = require("../controller/comment-controller")
const router = require("express").Router();

router.use((req, res, next) => {
    console.log("an request come to user route")
    next()
})

router.get('/getCommentsFromPost', commentController.getCommentsFromPost);

router.post('/create', commentController.createComment);

module.exports = router;