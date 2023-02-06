const Test = require('../schema/test-schema')

function addNewUser({username, password}) {
    let test = new Test({username, password})
    return test.save()
}

function getUserByID(id){
    return Test.findById(id);
}

function getUserByUsername(username){
    return Test.find({username: username});
}

function getAllUsers(){
    return Test.find();
}


exports.addNewUser = addNewUser
exports.getAllUser = getAllUsers
exports.getUserByID = getUserByID
exports.getUserByUsername = getUserByUsername
