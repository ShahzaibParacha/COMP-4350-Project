const userModel = require("../model/user-model")
const jwt = require("jsonwebtoken")

async function signup(email, password, username, isWriter) {
    await userModel.createNewUser({email, password, username, isWriter})
}

async function login(email, password) {
    let user = await userModel.getUserByEmail(email)

    if (user && user.password === password) {
        const tokenObj = {
            id: user._id,
            email: user.email
        }

        const token = jwt.sign(tokenObj, process.env.PASSPORT_SECRET)
        return {
            token: "JWT " + token,
            _id: user._id
        }
    } else {
        return null
    }
}

async function getUserInfo(id) {
    return await userModel.getUserById(id);
}

exports.signup = signup
exports.login = login
exports.getUserInfo = getUserInfo
