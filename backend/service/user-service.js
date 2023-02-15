const userModel = require("../model/user-model")
const userSchema = require("../schema/user-schema")
const jwt = require("jsonwebtoken")

async function signup({email, password, username, isWriter}) {
    return await userModel.createNewUser({email, password, username, isWriter})
}

async function getJwt(email, password) {
    let user = await userModel.getUserByEmail(email)
    await userSchema.updateOne({email: email}, {last_login_date: Date.now()})

    if (user && user.password === password) {
        const tokenObj = {
            id: user._id,
            email: user.email
        }

        const token = jwt.sign(tokenObj, process.env.PASSPORT_SECRET)
        return {
            token: "JWT " + token,
            id: user._id
        }
    } else {
        return null
    }
}

async function getUserInfo(id) {
    return await userModel.getUserById(id);
}

async function updateUserInfo({id, profilePhoto, isWriter, affiliation, bio }) {
    return await userModel.updateBasicInfo({id, profilePhoto, isWriter, affiliation, bio})
}

async function removeUser(id){
    return await userModel.removeUser(id)
}

async function updateUsername({id, newUsername}) {
    return await userModel.updateUsername({id, newUsername})
}

async function updatePassword({id, newPassword}) {
    return await userModel.updatePassword({id, newPassword})
}

exports.signup = signup
exports.getJwt = getJwt
exports.getUserInfo = getUserInfo
exports.updateUserInfo =  updateUserInfo
exports.removeUser = removeUser
exports.updateUsername = updateUsername
exports.updatePassword = updatePassword