const userController = require('../controller/user-controller');
const router = require('express').Router();
const userMiddleware = require('../middleware/user-middleware');

// add all routes which don't need authentication check in this file
router.post('/user/login', [userMiddleware.emailValidation, userMiddleware.passwordValidation], userController.login);
router.post('/user/signup', userMiddleware.all, userController.signup);

module.exports = router;
