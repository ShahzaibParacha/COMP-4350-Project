const ParamValidator = require("../util/ParamValidationUtil");
const Result = require("../util/Result");
const router = require("express").Router();


const userIdValidation = router.use((req, res, next) => {
    let userId = req.query.user_id
    if (userId !== undefined && userId !== null) {
        if (ParamValidator.isValidObjectId(userId) === false) {
            res.json(Result.invalidUserId())
            return
        }
    }

    userId = req.body.user_id
    if (userId !== undefined && userId !== null) {
        if (ParamValidator.isValidObjectId(userId) === false) {
            res.json(Result.invalidUserId())
            return
        }
    }

    next()
})

module.exports = [userIdValidation]
