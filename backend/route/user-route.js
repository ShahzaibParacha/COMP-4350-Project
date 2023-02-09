const userController = require("../controller/user-controller")
const router = require("express").Router();

router.use((req, res, next) => {
    console.log("an request come to user route")
    next()
})

router.get("/profile", userController.getUserProfile)
router.post("/profile", userController.updateUserProfile)
router.get("/delete_account", userController.removeAccount)
router.post("/username", userController.updateUsername)
router.post("/password", userController.updatePassword)

module.exports = router