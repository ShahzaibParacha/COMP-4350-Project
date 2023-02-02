const express = require("express");
require("dotenv").config()
const cors = require('cors')
const mongoose = require("mongoose")
const testModel = require("./model/test-model")

const app = express();
mongoose
    .connect(process.env.MONGODB_CONNECTION, {
                useNewUrlParser: true,
                useUnifiedTopology: true,})
    .then(() => {console.log("Success to connect mongodb")})
    .catch(() => {console.log("Fail to connect mongodb")})

app.use(cors())

app.get('/test', (req, res) => {
    console.log('Hello World')
    let username = "tom"
    let password = "tom122"
    testModel.addNewUser({username, password})
    res.send('Hello World')
})

app.listen(process.env.PORT, () => {
    console.log(`Comp4350 backend is listening on port ${process.env.PORT}`)
})
