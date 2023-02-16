const ParamValidator = require("../util/ParamValidationUtil");
const Result = require("../util/Result");


function userIdValidation(req, res, next) {
    console.log(`validating user_id`)
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
}

function emailValidation(req, res, next) {
    console.log(`validating email`)
    let email = req.query.email

    if (email !== undefined && email !== null) {
        if (ParamValidator.isValidEmail(email) === false) {
            res.json(Result.invalidEmail())
            return
        }
    }

    email = req.body.email

    if (email !== undefined && email !== null) {
        if (ParamValidator.isValidEmail(email) === false) {
            res.json(Result.invalidEmail())
            return
        }
    }

    next()
}

function passwordValidation(req, res, next) {
    let password = req.query.password
    console.log(`validating password`)
    if (password !== undefined && password !== null) {
        if (ParamValidator.isValidPassword(password) === false) {
            res.json(Result.invalidPassword())
            return
        }
    }

    password = req.body.password

    if (password !== undefined && password !== null) {
        if (ParamValidator.isValidPassword(password) === false) {
            res.json(Result.invalidPassword())
            return
        }
    }

    next()
}

module.exports = {userIdValidation, emailValidation, passwordValidation}
module.exports.all = [userIdValidation, emailValidation, passwordValidation]