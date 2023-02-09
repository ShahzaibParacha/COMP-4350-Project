const userController = require("../controller/user-controller")
const router = require("express").Router();

// add all routes which don't need authentication check in this file
router.post("/user/login", userController.login)
router.post("/user/signup", userController.singup)

module.exports = router