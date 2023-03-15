const { getCommentsFromPost, createComment } = require("../controller/comment-controller")
const router = require("express").Router();

router.use((req, res, next) => {
    console.log("an request come to user route")
    next()
})

router.get('/getCommentsFromPost', getCommentsFromPost);

router.post('/create', createComment);

module.exports = router;