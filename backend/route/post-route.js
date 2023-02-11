const postController = require("../controller/post-controller")
const router = require("express").Router();

router.post("/create", postController.createPost)
router.post("/update", postController.updatePostContent)
router.delete("/update", postController.removePostByID)
router.get("/get_recent_posts", postController.getRecentPost)
router.get("get_user_posts", postController.getAllPostsFromUser)

module.exports = router