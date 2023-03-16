const postController = require("../controller/post-controller")
const router = require("express").Router();

router.post("/create", postController.createPost)
router.post("/update", postController.updatePostContent)
router.delete("/update", postController.removePostByID)
router.get("/get_post_by_ID", postController.getPostByID)
router.get("/get_recent_posts", postController.getRecentPost)
router.get("/get_user_posts", postController.getAllPostsFromUser)
router.get("/get_subscribed_posts", postController.getSubscribedPosts)

module.exports = router