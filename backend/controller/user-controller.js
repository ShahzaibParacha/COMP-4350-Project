const userService = require("../service/user-service")
const Result = require("../util/Result")

function login(req, res) {
    let {email, password} = req.body
    console.log(email, password)
    userService.login(email, password)
        .then((result) => {
            if (result === null) {
                res.json(Result.fail("User or Password do not correct"))
            } else {
                res.json(Result.success(result))
            }
        })
}

function getUserProfile(req, res) {
    let {id} = req.query
    console.log("from controller" + req.query)

    userService.getUserInfo(id).then((user) => {
        if (user) {
            res.json(Result.success(user))
        } else {
            res.json(Result.fail("Cannot find user by given user id"))
        }
    })
}

exports.login = login
exports.getUserProfile = getUserProfile
