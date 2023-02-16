const userController = require("../controller/user-controller")
const router = require("express").Router();
const userMiddleware = require("../middleware/user-middleware")

// let allCheck = [userMiddleware.passwordValidation, userMiddleware.emailValidation, userMiddleware.userIdValidation]
// add all routes which don't need authentication check in this file

router.post("/user/login", [userMiddleware.emailValidation, userMiddleware.passwordValidation], userController.login)
router.post("/user/signup", userMiddleware.all, userController.singup)

module.exports = router