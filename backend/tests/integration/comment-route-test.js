const express = require("express");
const Comment = require('../../schema/comment-schema');
const User = require('../../schema/user-schema');
const mongoose = require('mongoose');
const expect = require('chai').expect;
const axios = require('axios');
require("dotenv").config();

const cors = require('cors')
const bodyParser = require('body-parser');
const apiRouter = require("../../route/api-route")
const passport = require("passport")
require("../../util/passport")(passport)

const username = 'completelyNewUsername';
const email = 'goodBoi@email.com';
const password = 'Password5';

let server;

/* setup
 *
 * Purpose: Generates a number of comments assigned to a number of posts
 * Input:
 * numUsers - the number users who leave comments
 * numComments - the number of comments
 * numPosts - the number of post created
 * 
 * Output:
 * Returns an object with three properties:
 * comments - the comments created
 * postIDs - the posts ids that corresponds to that comments
 * userIDs - the user ids who leave comments
 * res - the response returned by logging in
 */
const setup = async (numComments, numPosts, numUsers) => {
    let commentIDs = [];
    let postIDs = [];
    let userIDs = [];
    let i = 0;

    await Comment.deleteMany({});

    //creates an user id to leave comments
    for (i = 0; i < numUsers; i++){
        userIDs.push(new mongoose.mongo.ObjectID);
    }
    //userID = new mongoose.mongo.ObjectID;

    //generate post ids
    for (i = 0; i < numPosts; i++) {
        postIDs.push(new mongoose.mongo.ObjectID);
    }

    //generate random comments to numPosts posts
    for (i = 0; i < numComments; i++) {
        commentIDs.push(new mongoose.mongo.ObjectID);
        const attrib = {_id: commentIDs[i], post_id: postIDs[i % numPosts],
            user_id: userIDs[i % numUsers], content: i, comment_date: new Date(i * 1000000)};
        await Comment.create(attrib);
    }

 
    await User.findOneAndDelete({email});
    await User.create({username, email, password, _id: userIDs[0]}); 

    //login
    const res = await axios({
        method: "post",
        url: `http://localhost:4350/api/free/user/login`,
        data: {
          email,
          password,
        },
      });

    return { commentIDs, postIDs, userIDs, res };
}

describe('Comment routes', function () {

    before(async () => {
        const app = express();

        mongoose
        .connect(process.env.MONGODB_CONNECTION, {
            useNewUrlParser: true,
            useUnifiedTopology: true,})
            .then(() => {console.log("Success to connect mongodb");})
            .catch(() => {console.log("Fail to connect mongodb")});

        app.use(bodyParser.json({extended: true}));
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(cors())
            
        app.use("/api", apiRouter)
            
        server = app.listen(process.env.PORT, () => {
            console.log(`Comp4350 backend is listening on port ${process.env.PORT}`)
        })
    });

    after(async () => {
      await Comment.deleteMany({});
      await mongoose.disconnect();
      server.close();
    })

    describe('POST request to create', function() {
        const url = `http://localhost:4350/api/comment/create`;

        it('should return a comment', async function() {
            const { postIDs, userIDs, res } = (await setup(0, 1, 2)); //no comments, one post, two users

            await axios({
                method: "post",
                url: url,
                headers: {
                    Authorization: res.data.data.token,
                    withCredentials: true,
                  },
                data: {
                    content: '699',
                    post_id: postIDs[0], //to which post the comment is
                    user_id: userIDs[0], //who creates the comment
                },
              });

            const comments = await Comment.find({user_id: userIDs[0], post_id: postIDs[0]});

            expect(comments).to.exist;
            expect(comments.length).to.equal(1);
            expect(comments[0].content).to.equal('699');
        });

        it('should return two comments', async function() {
            const { postIDs, userIDs, res } = (await setup(4, 2, 2));

            await axios({
                method: "post",
                url: url,
                headers: {
                    Authorization: res.data.data.token,
                    withCredentials: true,
                  },
                data: {
                    content: '@#!',
                    post_id: postIDs[0],
                    user_id: userIDs[0],
                },
              });

            const comments = await Comment.find({user_id: userIDs[0] });
            expect(comments).to.exist;
            expect(comments.length).to.equal(3);
            expect(comments[0].content).to.equal('0');
            expect(comments[1].content).to.equal('2');
            expect(comments[2].content).to.equal('@#!');
        });

        it('should not succeed', async function() {
            const { postIDs, res } = (await setup(5, 1, 1));

            const response = await axios({
                method: "post",
                url: url,
                headers: {
                    Authorization: res.data.data.token,
                    withCredentials: true,
                  },
                data: {
                    content: '69',
                    user_id: '20',
                    post_id:  postIDs[0],
                },
              });

            expect(response.data.code).to.equal(40002);
        });

        it('should not succeed', async function() {
            const { userIDs, res } = (await setup(5, 1, 1));

            const response = await axios({
                method: "post",
                url: url,
                headers: {
                    Authorization: res.data.data.token,
                    withCredentials: true,
                  },
                data: {
                    content: '69',
                    user_id: userIDs[0],
                    post_id: '20',
                },
              });

            expect(response.data.code).to.equal(40003);
        });

        it('should not succeed', async function() {
            const { res } = (await setup(5, 1, 1));

            const response = await axios({
                method: "post",
                url: url,
                headers: {
                    Authorization: res.data.data.token,
                    withCredentials: true,
                  },
                data: {
                    content: '69',
                    user_id: 0,
                    post_id: 20,
                },
              });

            expect(response.data.code).to.equal(40000);
        });

     });
    
    describe('GET request to get_comments_from_post', function() {
        let url = `http://localhost:4350/api/comment/getCommentsFromPost`

        it('should return nothing', async function() {
            const { postIDs, res } = (await setup(0, 1, 1));

            const response = await axios({
                method: "get",
                url: url,
                headers: {
                    Authorization: res.data.data.token,
                    withCredentials: true,
                  },
                params: {
                    post_id: postIDs[0],
                },
              });

            expect(response.data.msg).to.equal('success');
            expect(response.data.data).to.exist;
            expect(response.data.data.length).to.equal(0);
        });

        it('should return nothing', async function() {
            const { token } = (await setup(10, 3, 2)).res.data.data;

            const res = await axios({
                method: "get",
                url: url,
                headers: {
                    Authorization: token,
                    withCredentials: true,
                  },
                params: {
                    post_id: new mongoose.mongo.ObjectID,
                },
              });

            expect(res.data.msg).to.equal('success');
            expect(res.data.data).to.exist;
            expect(res.data.data.length).to.equal(0);
        });

        it('should not succeed', async function() {
            const { token } = (await setup(10, 3, 5)).res.data.data;

            const res = await axios({
                method: "get",
                url: url,
                headers: {
                    Authorization: token,
                    withCredentials: true,
                  },
                params: {
                    post_id: 200,
                },
              });

            expect(res.data.code).to.equal(40003);
        });

        it('should not succeed', async function() {
            const { token } = (await setup(10, 3, 3)).res.data.data;

            const res = await axios({
                method: "get",
                url: url,
                headers: {
                    Authorization: token,
                    withCredentials: true,
                  },
                params: {
                    post_id: '20',
                },
              });

            expect(res.data.code).to.equal(40003);
        });

        it('should return all comments with even content', async function() {
            const { postIDs, res } = (await setup(10, 2, 2));

            const response = await axios({
                method: "get",
                url: url,
                headers: {
                    Authorization: res.data.data.token,
                    withCredentials: true,
                  },
                params: {
                    post_id: postIDs[0],
                },
              });

            expect(response.data.msg).to.equal('success');
            expect(response.data.data).to.exist;
            expect(response.data.data.length).to.equal(5);
            for (let i = 0; i < response.data.data.length; i++) {
                expect(response.data.data[i].content % 2).to.equal(0);
            }
        });

    });

});
