const passport = require("passport");
const router = require("express").Router();
const freeRoute = require("./free-route")
const userRoute = require("./user-route")
const userMiddleware = require("../middleware/user-middleware")
const commentRoute = require("./comment-route");
const postRoute = require("./post-route")

router.use("/free", freeRoute)
router.use("/user", passport.authenticate("jwt", {session: false}), userMiddleware.all, userRoute)
router.use("/comment", passport.authenticate("jwt", {session: false}), commentRoute)
router.use("/post", passport.authenticate("jwt", {session: false}), postRoute)

module.exports = router