const User = require("../schema/user-schema")

async function createNewUser(userInfo) {
    // username, email, password, birthday, is_writer, registration_date, last_login_date, bio,affiliation
    const user = new User({
        username: userInfo.username,
        password: userInfo.password,
        email: userInfo.email,
        is_writer: userInfo.isWriter,
        registration_date: Date.now(),
        last_login_date: null,
        bio: null,
        affiliation: null
    });

    user.save()
}

// return true means username and password correct, false means username and password not match
async function identifyUser({username, password}) {
    let user = await User.findOne({username: username})
    return user.password === password;
}

async function getUserById(id) {
    return await User.findById(id)
}

async function getUserByUsername(username) {
    return await User.findOne({username: username})
}

async function getUserByEmail(email) {
    return await User.findOne({email: email})
}

async function updateUsername({id, newUsername}) {
    let result = await User.updateOne({_id: id}, {username: newUsername})
    console.log("this is the result " + JSON.stringify(result))
    return result.ok === 1
}

async function updateBasicInfo({id, isWriter, profilePhoto, bio, affiliation}) {
    let result = await User.updateOne({_id: id}, {
        is_writer: isWriter,
        profile_photo: profilePhoto,
        bio: bio,
        affiliation: affiliation
    })

    return result.ok === 1
}

async function updatePassword({id, newPassword}) {
    let result = await User.updateOne({_id: id}, {password: newPassword})
    return result.ok === 1
}

async function removeUser(id) {
    let result = await User.remove({_id: id})
    return result.ok === 1
}

exports.getUserById = getUserById
exports.createNewUser = createNewUser
exports.getUserByEmail = getUserByEmail
exports.getUserByUsername = getUserByUsername
exports.updateUsername = updateUsername
exports.updatePassword = updatePassword
exports.updateBasicInfo = updateBasicInfo
exports.removeUser = removeUser