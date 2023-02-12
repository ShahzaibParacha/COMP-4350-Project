const mongoose = require("mongoose");

function isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

function isValidUsername(username) {
    return typeof username === "string" && username.length >= 3 && username.length <= 30
}

function isValidPassword(password) {
    if (!(typeof password === "string" && password.length >= 8 && password.length <= 20)) return false

    let re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=\S+$).{3,}$/;
    return re.test(password)
}

function isValidEmail(email) {
    if (!(typeof email === "string" && email.length >= 8 && email.length <= 20))
        return false

    let validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return validRegex.test(email)
}

exports.isValidObjectId = isValidObjectId
exports.isValidUsername = isValidUsername
exports.isValidPassword = isValidPassword
exports.isValidEmail = isValidEmail