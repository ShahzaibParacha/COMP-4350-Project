const userService = require('../service/user-service');
const sinon = require("sinon");
const mongoose = require('mongoose');
const User = require("../schema/user-schema");
const expect = require('chai').expect;
require("dotenv").config();


let userList = []

function resetUserList() {
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
            let a = userList.find(user => user.username === param.username)
            if (a === undefined) {
                return null
            }
            return a
        } else if (param.hasOwnProperty('email')) {
            return userList.find(user => user.email === param.email)
        } else if (param.hasOwnProperty("_id")) {
            return userList.find(user => user._id === param._id)
        }

        return null
    })

    sinon.stub(User, 'updateOne').callsFake((condition, update) => {
        if (condition._id === undefined || condition._id === null)
            return {ok: 0}

        let user = userList.find(user => user._id === condition._id)

        if (user) {
            if (update.hasOwnProperty('username')) {
                user.username = update.username
            } else if (update.hasOwnProperty('password')) {
                user.password = update.password
            } else {
                // isWriter, profilePhoto, bio, affiliation
                user.is_writer = update.isWriter
                user.profile_photo = update.profilePhoto
                user.bio = update.bio
                user.affiliation = update.affiliation
            }

            return {ok: 1}
        }

        return {ok: 0}
    })

    sinon.stub(User, 'create').callsFake(() => {
        userList.push()
        return true
    })

    sinon.stub(User, 'remove').callsFake((param) => {
        userList = userList.filter(user => user._id !== param._id)
        return {ok: 1}
    })
}

describe('User service and model', function () {

    beforeEach(() => {
        resetUserList()
        setFakeDatabase()
    })

    afterEach(() => {
        sinon.restore()
    })

    describe('test update username', function () {
        it('should return true since the input new username is available', async function () {
            let user = userList.find(user => user.username === 'Xin An')
            let result = await userService.updateUsername({id: user._id, newUsername: "Xiang Li"})
            expect(result).to.equal(true)
        });

        it('should return false since the user id is invalid', async function () {
            let user = userList.find(user => user.username === 'Xin An')
            let result = await userService.updateUsername({id: user._id+"aabb", newUsername: "Xiang Li"})
            expect(result).to.equal(false)
        });

        it('should return false since the input new username has already exist in database', async function () {
            let user = userList.find(user => user.username === 'Xin An')
            let result = await userService.updateUsername({id: user._id, newUsername: "Qiqiang Gao"})
            expect(result).to.equal(false)
        })

        it('should return false since the length of new username is invalid', async () => {
            let user = userList.find(user => user.username === 'Xin An')
            let result = await userService.updateUsername({id: user._id, newUsername: "ab"})
            expect(result).to.equal(false)
            result = await userService.updateUsername({
                id: user._id,
                newUsername: "this is a very very very very long username!!!!!!!!!!!!!!!!!"
            })
            expect(result).to.equal(false)
        })

        it('should return false since the new username is null or undefined ', async () => {
            let user = userList.find(user => user.username === 'Xin An')
            let result = await userService.updateUsername({id: user._id, newUsername: null})
            expect(result).to.equal(false)
            result = await userService.updateUsername({
                id: user._id,
                newUsername: undefined
            })
            expect(result).to.equal(false)
        })


    })

    describe('test update password', function () {
        it('should return true since the input new password is available', async function () {
            let user = userList.find(user => user.username === 'Xin An')
            let result = await userService.updatePassword({id: user._id, newPassword: "This1snewpassword"})
            expect(result).to.equal(true)
        });

        it('should return false since the password is invalid', async () => {
            let user = userList.find(user => user.username === 'Xin An')
            let result = await userService.updateUsername({id: user._id, newPassword: "ab"})
            expect(result).to.equal(false)
            result = await userService.updatePassword({
                id: user._id,
                newPassword: "this is a very very very very long password!!!!!!!!!!!!!!!!!"
            })
            expect(result).to.equal(false)
        })

        it('should return false since the user id is invalid', async () => {
            let user = userList.find(user => user.username === 'Xin An')
            let result = await userService.updateUsername({id: user._id, newPassword: "ab"})
            expect(result).to.equal(false)
            result = await userService.updatePassword({
                id: user._id + "aabb",
                newPassword: "This1snewpassword"
            })
            expect(result).to.equal(false)
        })

        it('should return false since the new password not follow the rule', async () => {
            let user = userList.find(user => user.username === 'Xin An')
            let result = await userService.updateUsername({id: user._id, newPassword: "nouppcasepassword1"})
            expect(result).to.equal(false)

            result = await userService.updateUsername({id: user._id, newPassword: "NO_LOWERCASE_1"})
            expect(result).to.equal(false)

            result = await userService.updateUsername({id: user._id, newPassword: "There isalowercase1"})
            expect(result).to.equal(false)
        })
    })

    describe('Test get jwt', function () {
        it('should exist since the username and password matched', async () => {
            let user = userList.find(user => user.username === 'Xin An')
            let result = await userService.getJwt(user.email, user.password)
            expect(result.id).to.exist
            expect(result.token).to.exist
        })

        it('should return null since the password not correct', async () => {
            let user = userList.find(user => user.username === 'Xin An')
            let result = await userService.getJwt(user.email, 'Uncorrect1')
            expect(result).to.not.exist
        })

        it('should return null since the username does not exist', async () => {
            let user = userList.find(user => user.username === 'Xin An')
            let result = await userService.getJwt("aabb@ccdd.com", user.password)
            expect(result).to.not.exist
        })
    })

    describe('Test sign up', function () {
        it('should return true since all user information valid', async () => {
            let result = await userService.signup({
                username: "Tom",
                email: "tom@umanitoba.com",
                password: "tomTom123",
                is_writer: false,
            })
            expect(result).to.equal(true)
        })

        it('should return false since the username already in exist', async () => {
            let result = await userService.signup({
                email: 'qishen@qiangshen.com',
                password: 'Qishen12345',
                username: 'Xin An',
                isWriter: true
            })
            expect(result).to.equal(false)
        })

        it('should return false since the username is invalid', async () => {
            let result = await userService.signup({
                email: 'qishen@qiangshen.com',
                password: 'Qishen12345',
                username: 'an',
                isWriter: true
            })
            expect(result).to.equal(false)
        })

        it('should return false since the email already in exist', async () => {
            let result = await userService.signup({
                email: 'anxin@qq.com',
                password: 'Qishen12345',
                username: 'Xin An',
                isWriter: true
            })
            expect(result).to.equal(false)
        })

    })

    describe('Test delete account', function () {
        it('should return true since the user id valid', async () => {
            let user = userList.find(user => user.username === 'Xin An')
            let result = await userService.removeUser(user._id)
            expect(result).to.equal(true)
        })

        it('should return false since the user id invalid', async () => {
            let result = await userService.removeUser("aabbccdd")
            expect(result).to.equal(false)
        })

        it('should return false since the user id is null', async () => {
            let result = await userService.removeUser(null)
            expect(result).to.equal(false)
        })
    })

    describe('Test get user information account', function () {
        it('should get the user since the user id is valid', async () => {
            let user = userList.find(user => user.username === 'Xin An')
            let result = await userService.getUserInfo(user._id)
            expect(result.email).to.exist
            expect(result.username).to.exist
        })

        it('cannot get the user since the user id is invalid', async () => {
            let user = userList.find(user => user.username === 'Xin An')
            let result = await userService.getUserInfo(user._id + "aabbcc")
            expect(result).to.not.exist
        })

        it('cannot get the user since the user id is invalid', async () => {
            let result = await userService.getUserInfo(null)
            expect(result).to.not.exist
        })
    })

    describe('Test update user information account', function () {
        it('should return ture since the updated information are valid', async () => {
            let user = userList.find(user => user.username === 'Xin An')
            let result = await userService.updateUserInfo({
                id: user._id,
                profilePhoto: "new photo",
                isWriter: true,
                affiliation: "this is new affiliation",
                bio: "this is new bio"
            })

            expect(result).to.equal(true)
        })

        it('should return false since the user id is invalid', async () => {
            let user = userList.find(user => user.username === 'Xin An')
            let result = await userService.updateUserInfo({
                id: user._id + "aabb",
                profilePhoto: "new photo",
                isWriter: true,
                affiliation: "this is new affiliation",
                bio: "this is new bio"
            })

            expect(result).to.equal(false)
        })

        it('should return false since the user id is not in database', async () => {
            let result = await userService.updateUserInfo({
                id: new mongoose.mongo.ObjectID(),
                profilePhoto: "new photo",
                isWriter: true,
                affiliation: "this is new affiliation",
                bio: "this is new bio"
            })

            expect(result).to.equal(false)
        })

        it('should return true since the user do not update anything', async () => {
            let user = userList.find(user => user.username === 'Xin An')
            let result = await userService.updateUserInfo({
                id: user._id,
            })

            expect(result).to.equal(true)
        })
    })
})