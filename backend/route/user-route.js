const express = require("express");
const userController = require("../controller/user-controller")
const router = require("express").Router();

router.use((req, res, next) => {
    console.log("an request come to user route")
    next()
})

router.get("/profile", userController.getUserProfile)

module.exports = router