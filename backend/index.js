const express = require("express");
require("dotenv").config()
const cors = require('cors')
const mongoose = require("mongoose")
const userRoute = require("./route/user-route")
const freeRoute = require("./route/free-route")
const commentRoute = require('./route/comment-route');
const bodyParser = require('body-parser');
const passport = require("passport")
require("./util/passport")(passport)

const app = express();
mongoose
    .connect(process.env.MONGODB_CONNECTION, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Success to connect mongodb")
    })
    .catch(() => {
        console.log("Fail to connect mongodb")
    })

app.use(bodyParser.json({extended: true}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors())

app.use("/api/free",freeRoute)
app.use("/api/user", passport.authenticate("jwt", {session: false}), userRoute)
app.use("/api/comment", passport.authenticate("jwt", {session: false}), commentRoute)

// just for sample test, delete before sprint2 due
app.post("/test", (req, res) => {
    console.log(req.body)
    res.send(req.body)
})

app.get('/test', (req, res) => {
    res.send(req.query)
})


app.listen(process.env.PORT, () => {
    console.log(`Comp4350 backend is listening on port ${process.env.PORT}`)
})
