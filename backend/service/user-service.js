const userModel = require("../model/user-model")
const jwt = require("jsonwebtoken")

async function signup({email, password, username, isWriter}) {
    await userModel.createNewUser({email, password, username, isWriter})
}

async function getJwt(email, password) {
    let user = await userModel.getUserByEmail(email)

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
    if(id === undefined || id === null)
        return false;

    let user = await userModel.getUserById(id)
    if(user === undefined || user === null)
        return false

    if(profilePhoto === undefined || profilePhoto === null) {
        profilePhoto = user.profile_photo
    }

    if(isWriter === undefined || isWriter == null) {
        isWriter = user.is_writer
    }

    if(affiliation === undefined || affiliation === null){
        affiliation = user.affiliation
    }

    if(bio === undefined || bio === null){
        bio = user.bio
    }

    return await userModel.updateBasicInfo({id, profilePhoto, isWriter, affiliation, bio})
}

async function removeUser(id){
    if(id === undefined || id === null)
        return false

    return await userModel.removeUser(id)
}

async function updateUsername({id, newUsername}) {
    if(id === undefined || id === null)
        return false

    if (await userModel.getUserByUsername(newUsername) !== null) { // means the username have already, the user cannot use this
        return false
    }

    return await userModel.updateUsername({id, newUsername})
}

async function updatePassword({id, newPassword}) {
    if(id === undefined || id === null)
        return false

    return await userModel.updatePassword({id, newPassword})
}

exports.signup = signup
exports.getJwt = getJwt
exports.getUserInfo = getUserInfo
exports.updateUserInfo =  updateUserInfo
exports.removeUser = removeUser
exports.updateUsername = updateUsername
exports.updatePassword = updatePassword