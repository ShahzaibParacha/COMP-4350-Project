const userController = require('../controller/user-controller');
const router = require('express').Router();
const userMiddleware = require('../middleware/user-middleware');

router.get('/profile', userController.getUserProfile);
router.post('/profile', userController.updateUserProfile);
router.get('/delete_account', userController.removeAccount);
router.post('/username', userController.updateUsername);
router.post('/password', userController.updatePassword);
router.post('/subscription/followNewUser', userMiddleware.subscriptionValidation, userController.subscribeUser);
router.get('/subscription/getFollowing', userController.getMyFollowing);
router.get('/subscription/getAudience', userController.getMyAudience);
router.post('/subscription/setNotification', userMiddleware.setNotificationValidation, userController.setNotification);
router.get('/subscription/cancel', userMiddleware.unsubscriptionValidation, userController.cancelSubscription);
router.get('/subscription/isSubscribed', userController.isSubscribed);
router.get('/subscription/getSubscription', userController.getSubscription);

module.exports = router;
