const userService = require('../service/user-service');
const sinon = require("sinon");
const mongoose = require('mongoose');
const User = require("../schema/user-schema");
const Comment = require("../schema/comment-schema");
const expect = require('chai').expect;
require("dotenv").config();


let userList = []

function resetUserList() {
    console.log("reset user list...")
    userList = []
    userList.push({
        _id: new mongoose.mongo.ObjectID(),
        username: "Qiqiang Gao",
        email: "qiqiang@qiangsheng.com",
        password: "wojiaoqiqiang",
        is_writer: true,
        profile_photo: "default",
        bio: "",
        affiliation: ""
    })
    userList.push({
        _id: new mongoose.mongo.ObjectID(),
        username: "Xin An",
        email: "anxin@qq.com",
        password: "abcabc",
        is_writer: false,
        profile_photo: "default",
        bio: "",
        affiliation: ""
    })
    userList.push({
        _id: new mongoose.mongo.ObjectID(),
        username: "Jiang Xu",
        email: "jiang@shenmedangci.com",
        password: "shiwoxiaojiang",
        is_writer: false,
        profile_photo: "default",
        bio: "",
        affiliation: ""
    })
    userList.push({
        _id: new mongoose.mongo.ObjectID(),
        username: "Youtian Li",
        email: "youtian@mang.com",
        password: "youtianxiashan",
        is_writer: false,
        profile_photo: "default",
        bio: "",
        affiliation: ""
    })
}

function setFakeDatabase() {
    sinon.stub(User, 'findOne').callsFake((param) => {
        if (param.hasOwnProperty('username')) {
            return userList.find(user => user.username === param.username)
        } else if (param.hasOwnProperty('email')) {
            return userList.find(user => user.email === param.email)
        } else if (param.hasOwnProperty("id")) {
            return userList.find(user => user._id === param.id)
        }

        return null
    })
    // sinon.stub(Post, 'findOneAndUpdate').callsFake(({_id: id}, {content}) => {
    sinon.stub(User, 'updateOne').callsFake(( {_id: _id}, {username}) => {
        let a = 1/0
        console.log(`from fake database ${_id}, ${username}`)
        // let user = userList.find(user => user._id === _id)
        // console.log(`from fake database: ${user}`)
        // if (user) {
        //     if (param.hasOwnProperty('newUsername')) {
        //         user.username = param.newUsername
        //     } else if (param.hasOwnProperty('password')) {
        //         user.password = param.password
        //     } else {
        //         // isWriter, profilePhoto, bio, affiliation
        //         user.is_writer = param.isWriter
        //         user.profile_photo = param.profilePhoto
        //         user.bio = param.bio
        //         user.affiliation = param.affiliation
        //     }
        //
        //     return {ok: 1}
        // }

        return {ok: 0}
    })
}

describe('User service and model', function () {
    beforeEach(() => {
        resetUserList()
        setFakeDatabase()
    })
    describe('test update username',function () {

        it('should return true since the input new username is available', async function () {
            let user = userList.find(user => user.username === 'Xin An')
            let result = await userService.updateUsername({id: user._id, newUsername: "Xiang Li"})

            console.log("the result is " + result)
            expect(result).to.equal(true)
            expect(userList.find(updatedUser => updatedUser._id === user._id).username).to.equal('Xiang Li')
        });
    })
})