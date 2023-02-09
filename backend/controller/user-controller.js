const userService = require("../service/user-service")
const Result = require("../util/Result")

function login(req, res) {
    let {email, password} = req.body
    console.log(email, password)
    userService.getJwt(email, password)
        .then((result) => {
            if (result === null) {
                res.json(Result.fail("User or Password do not correct"))
            } else {
                res.json(Result.success(result))
            }
        })
}

function signup(req, res) {
    let {username, email, password} = req.body
    let isWriter = req.body.is_writer
    userService.signup({email, password, username, isWriter})
        .then(() => {
            res.json(Result.success(null))
        })
}

function getUserProfile(req, res) {
    let id = req.query.user_id
    console.log("from controller" + req.query)

    userService.getUserInfo(id).then((user) => {
        if (user) {
            res.json(Result.success(user))
        } else {
            res.json(Result.fail("Cannot find user by given user_id"))
        }
    })
}

function updateUserProfile(req, res) {
    let id = req.body.user_id
    let profilePhoto = req.body.profile_photo
    let isWriter = req.body.is_writer
    let {affiliation, bio} = req.body

    userService.updateUserInfo({id, profilePhoto, isWriter, affiliation, bio}).then((result) => {
        if (result === true) {
            res.json(Result.success(null))
        } else {
            res.json(Result.fail("Cannot update user information by given user_id"))
        }
    })
}

function removeAccount(req, res) {
    let id = req.query.user_id

    userService.removeUser(id).then((result) => {
        if (result === true) {
            res.json(Result.success(null))
        } else {
            res.json(Result.fail("Cannot remove user by given user_id, or the user_id doesn't exist"))
        }
    })
}

function updateUsername(req, res) {
    let id = req.body.user_id
    let newUsername = req.body.new_username

    userService.updateUsername({id, newUsername}).then((result => {
        if (result === true) {
            res.json(Result.success(null))
        } else {
            res.json(Result.fail("Fail to update username by given user_id"))
        }
    }))
}

function updatePassword(req, res) {
    let id = req.body.user_id
    let newPassword = req.body.new_password

    userService.updatePassword({id, newPassword}).then((result => {
        if (result === true) {
            res.json(Result.success(null))
        } else {
            res.json(Result.fail("Fail to update password by given user_id"))
        }
    }))
}

exports.login = login
exports.singup = signup
exports.getUserProfile = getUserProfile
exports.updateUserProfile = updateUserProfile
exports.removeAccount = removeAccount
exports.updateUsername = updateUsername
exports.updatePassword = updatePassword
