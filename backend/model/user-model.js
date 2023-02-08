const UserSchema = require("../schema/user-schema")

async function createNewUser(userInfo) {
    // username, email, password, birthday, is_writer, registration_date, last_login_date, bio,affiliation
    const user = new UserSchema({
        username: userInfo.username,
        password: userInfo.password,
        email: userInfo.email,
        is_writer: userInfo.isWriter,
        registration_date: Date.now(),
        last_login_date: null,
        bio: null,
        affiliation: null
    });

    await user.save()
}

// return true means username and password correct, false means username and password not match
async function identifyUser({username, password}) {
    let user = await UserSchema.findOne({username: username})
    return user.password === password;
}

async function getUserById(id) {
    return await UserSchema.findById(id)
}

function getUserByUsername(username) {
    return UserSchema.findOne({username: username})
}

function getUserByEmail(email) {
    return UserSchema.findOne({email: email})
}

async function updateUsername(userInfo) {
    let {id, newUsername} = userInfo

    if (await getUserByUsername(newUsername) !== null) {
        return false
    }

    await UserSchema.findOneAndUpdate({_id: id}, {username: newUsername})
    return true
}

async function updatePassword(userInfo) {
    let {id, password} = userInfo;

    await UserSchema.findOneAndUpdate({_id: id}, {password: password})
    return true
}

async function updateBasicInfo({id, isWriter, profilePhoto, bio, affiliation}) {
    await UserSchema.updateOne({_id: id}, {is_writer: isWriter, profile_photo: profilePhoto, bio: bio, affiliation: affiliation})
    return true;
}


exports.getUserById = getUserById
exports.createNewUser = createNewUser
exports.getUserByEmail = getUserByEmail
exports.getUserByUsername = getUserByUsername
exports.updateUsername = updateUsername
exports.updatePassword = updatePassword
exports.updateBasicInfo = updateBasicInfo