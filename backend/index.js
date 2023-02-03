const express = require("express");
require("dotenv").config()
const cors = require('cors')
const mongoose = require("mongoose")

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
    res.send('Hello World')
})

//test for comment routes and models
const commentRoutes = require('./route/comment-route')
app.use(express.json())
app.use((req, res, next)=>{
    console.log(req.path, req.method)
    next()
})
app.use('/api/comments', commentRoutes)

app.listen(process.env.PORT, () => {
    console.log(`Comp4350 backend is listening on port ${process.env.PORT}`)
})
