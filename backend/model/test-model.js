const {Test} = require('../schema/test-schema')

function addNewUser({username, password}) {
    let test = new Test({username, password})
    return test.save()
}

function getAllUsers(){
    return Test.find();
}

exports.addNewUser = addNewUser
exports.getAllUser = getAllUsers
