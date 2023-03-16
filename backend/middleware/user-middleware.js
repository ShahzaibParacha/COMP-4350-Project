const ParamValidator = require("../util/ParamValidationUtil");
const Result = require("../util/Result");
const subscriberModel = require("../model/subscriber-model")


function userIdValidation(req, res, next) {
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

function audienceIdValidation(req, res, next) {
    let audienceId = req.query.audience_id

    if (audienceId !== undefined && audienceId !== null) {
        if (ParamValidator.isValidObjectId(audienceId) === false) {
            res.json(Result.invalidAudienceId())
            return
        }
    }

    audienceId = req.body.audience_id

    if (audienceId !== undefined && audienceId !== null) {
        if (ParamValidator.isValidObjectId(audienceId) === false) {
            res.json(Result.invalidAudienceId())
            return
        }
    }

    next()
}

function creatorIdValidation(req, res, next) {
    let creatorId = req.query.creator_id

    if(creatorId !== undefined && creatorId !== null) {
        if(ParamValidator.isValidObjectId(creatorId) === false) {
            res.json(Result.invalidCreatorId())
            return
        }
    }

    creatorId = req.body.creator_id

    if(creatorId !== undefined && creatorId !== null) {
        if(ParamValidator.isValidObjectId(creatorId) === false) {
            res.json(Result.invalidCreatorId())
            return
        }
    }

    next()
}

function subscriptionValidation(req, res, next) {
    let creatorId = req.body.creator_id
    let audienceId = req.body.user_id

    console.log(`creator is is ${creatorId}, audience id is ${audienceId}`)

    if(creatorId === audienceId){
        res.json(Result.idsConflict())
        return
    }

    subscriberModel.getSubscription(creatorId, audienceId).then((result) => {
        if(result === undefined || result === null) {
            next()
        } else {
            res.json(Result.alreadySubscribe())
        }
    })
}

function unsubscriptionValidation(req, res, next) {
    let creatorId = req.query.creator_id
    let audienceId = req.query.user_id

    console.log(`creator is is ${creatorId}, audience id is ${audienceId}`)

    if(creatorId === audienceId){
        res.json(Result.idsConflict())
        return
    }

    subscriberModel.getSubscription(creatorId, audienceId).then((result) => {
        if(result === undefined || result === null) {
            res.json(Result.notSubscribe())
        } else {
            next()
        }
    })
}

function setNotificationValidation(req, res, next) {
    let creatorId = req.body.creator_id
    let audienceId = req.body.user_id
    let setting = req.body.set_notification

    console.log(`creator is is ${creatorId}, audience id is ${audienceId}, settings is ${setting}`)

    if(creatorId === audienceId){
        res.json(Result.idsConflict())
        return
    }

    subscriberModel.getSubscription(creatorId, audienceId).then((result) => {
        if(result === undefined || result === null) {
            res.json(Result.notSubscribe())
        } else {
            next()
        }
    })
}

module.exports = {userIdValidation, emailValidation, passwordValidation, audienceIdValidation, creatorIdValidation, subscriptionValidation, unsubscriptionValidation, setNotificationValidation}
module.exports.all = [userIdValidation, emailValidation, passwordValidation, audienceIdValidation, creatorIdValidation]