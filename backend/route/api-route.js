const passport = require("passport");
const router = require("express").Router();
const freeRoute = require("./free-route")
const userRoute = require("./user-route")
const userMiddleware = require("../middleware/user-middleware")

router.use(userMiddleware)

router.use("/free",freeRoute)
router.use("/user", passport.authenticate("jwt", {session: false}), userRoute)

module.exports = router