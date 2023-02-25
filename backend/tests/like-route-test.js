const express = require("express");
const Like = require('../schema/likes-schema');
const User = require('../schema/user-schema');
const mongoose = require('mongoose');
const expect = require('chai').expect;
const axios = require('axios');
require("dotenv").config();

const cors = require('cors')
const bodyParser = require('body-parser');
const apiRouter = require("../route/api-route")
const passport = require("passport");
const { post } = require("../route/api-route");
require("../util/passport")(passport)

const username = 'completelyNewUsername';
const email = 'goodBoi@email.com';
const password = 'Password5';

let server;

/* setup
 *
 * Purpose: Generates a number of posts assigned to a number of users and creates an account
 * Input:
 * numPosts - the number of posts to create
 * numUsers - the number of users who created the posts
 * 
 * Output:
 * Returns an object with three properties:
 * posts - the posts created
 * userIDs - the user ids of the users that made the posts
 * res - the response returned by logging in
 */
const setup = async (numPosts, numUsers, numLikes) => {
    let postIDs = [];
    let userIDs = [];
    let i = 0, userIdx = 0, postIdx = 0;

    if (numLikes <= numPosts * numUsers) {

        await Like.deleteMany({});

        //generate user ids
        for (i = 0; i < numUsers; i++) {
            userIDs.push(new mongoose.mongo.ObjectID);
        }

        //generate random posts created by numUsers users
        for (i = 0; i < numPosts; i++) {
            postIDs.push(new mongoose.mongo.ObjectID);
        }

        //the first user will like the first post
        //the second user will like the first post
        //...
        //the last user will like the first post
        //the first user will like the second post
        //...
        //the last user will like the last post
        for (i = 0; i < numLikes; i++) {
            await Like.create({ post_id: postIDs[postIdx], user_id: userIDs[userIdx] });

            userIdx++;
            if (userIdx >= numUsers) {
                userIdx = 0;
                postIdx = (postIdx + 1) % numPosts;
            }
        }
    }

    //creates an account
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

    return { postIDs, userIDs, res };
}

const testInvalidIDs = async (res, req, route, valid_post, valid_user, codes) => {
    let resp = await axios({
        method: req,
        params: {
          user_id: 20,
          post_id: valid_post
        },
        url: route,
        headers: {
            Authorization: res.data.data.token,
            withCredentials: true,
          },
        data: {
            user_id: 20,
            post_id: valid_post
        }
      });

    expect(resp.data.code).to.equal(codes[0]);

    resp = await axios({
        method: req,
        params: {
          user_id: '20',
          post_id: valid_post
        },
        url: route,
        headers: {
            Authorization: res.data.data.token,
            withCredentials: true,
          },
        data: {
            user_id: '20',
            post_id: valid_post
        }
      });

    expect(resp.data.code).to.equal(codes[1]);

    resp = await axios({
        method: req,
        params: {
          user_id: valid_user,
          post_id: 20
          },
        url: route,
        headers: {
            Authorization: res.data.data.token,
            withCredentials: true,
          },
        data: {
            user_id: valid_user,
            post_id: 20
        }
      });

    expect(resp.data.code).to.equal(codes[2]);

    resp = await axios({
        method: req,
        params: {
          user_id: valid_user,
          post_id: '20'
          },
        url: route,
        headers: {
            Authorization: res.data.data.token,
            withCredentials: true,
          },
        data: {
            user_id: valid_user,
            post_id: '20'
        }
      });

    expect(resp.data.code).to.equal(codes[3]);
}

describe('Like routes', function () {

    beforeEach(async () => {
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

    afterEach(async () => {
        await mongoose.disconnect();
        server.close();
    });

    describe('GET request to getNumLikes', function() {

        it('should return 0', async function() {
            const { postIDs, res } = (await setup(1, 1, 0));

            const resp = await axios({
                method: "get",
                params: {
                  post_id: postIDs[0],
                },
                url: `http://localhost:4350/api/like/getNumLikes`,
                headers: {
                    Authorization: res.data.data.token,
                    withCredentials: true,
                  },      
              });

            expect(resp.data.msg).to.equal('success');
            expect(resp.data.data).to.exist;
            expect(resp.data.data).to.equal(0);
        });

        it('should return 5', async function() {
            const { postIDs, res } = (await setup(1, 5, 5));

            const resp = await axios({
                method: "get",
                params: {
                  post_id: postIDs[0],
                },
                url: `http://localhost:4350/api/like/getNumLikes`,
                headers: {
                    Authorization: res.data.data.token,
                    withCredentials: true,
                  },
              });

            expect(resp.data.msg).to.equal('success');
            expect(resp.data.data).to.exist;
            expect(resp.data.data).to.equal(5);
        });

        it('should return 5', async function() {
            const { postIDs, res } = (await setup(2, 5, 7));

            const resp = await axios({
                method: "get",
                params: {
                  post_id: postIDs[1],
                },
                url: `http://localhost:4350/api/like/getNumLikes`,
                headers: {
                    Authorization: res.data.data.token,
                    withCredentials: true,
                  },
              });

            expect(resp.data.msg).to.equal('success');
            expect(resp.data.data).to.exist;
            expect(resp.data.data).to.equal(2);
        });

        it('should not succeed', async function() {
            const { res } = (await setup(1, 1, 1));

            const resp = await axios({
                method: "get",
                params: {
                  post_id: 20,
                },
                url: `http://localhost:4350/api/like/getNumLikes`,
                headers: {
                    Authorization: res.data.data.token,
                    withCredentials: true,
                  },
              });

            expect(resp.data.code).to.equal(40003);
        });

        it('should not succeed', async function() {
            const { res } = (await setup(1, 1, 1));

            const resp = await axios({
                method: "get",
                params: {
                  post_id: '20',
                },
                url: `http://localhost:4350/api/like/getNumLikes`,
                headers: {
                    Authorization: res.data.data.token,
                    withCredentials: true,
                  },
              });

            expect(resp.data.code).to.equal(40003);
        });
    });

    describe('GET request to userLikedPost', function() {

        it('should return false', async function() {
            const { userIDs, postIDs, res } = (await setup(1, 1, 0));

            const resp = await axios({
                method: "get",
                params: {
                  user_id: userIDs[0],
                  post_id: postIDs[0]
                  },
                url: `http://localhost:4350/api/like/userLikedPost`,
                headers: {
                    Authorization: res.data.data.token,
                    withCredentials: true,
                  },
              });

            expect(resp.data.msg).to.equal('success');
            expect(resp.data.data).to.exist;
            expect(resp.data.data).to.equal(false);
        });

        it('should return true', async function() {
            const { userIDs, postIDs, res } = (await setup(1, 1, 1));

            const resp = await axios({
                method: "get",
                params: {
                  user_id: userIDs[0],
                  post_id: postIDs[0]
                  },
                url: `http://localhost:4350/api/like/userLikedPost`,
                headers: {
                    Authorization: res.data.data.token,
                    withCredentials: true,
                  },
              });

            expect(resp.data.msg).to.equal('success');
            expect(resp.data.data).to.exist;
            expect(resp.data.data).to.equal(true);
        });

        it('should not succeed', async function() {
            const { userIDs, postIDs, res } = (await setup(1, 1, 1));

            await testInvalidIDs(res, 'get', `http://localhost:4350/api/like/userLikedPost`, postIDs[0], userIDs[0], [40002, 40002, 40003, 40003]);
        });
    });

    describe('POST request to likePost', function() {

        it('number of likes should be 2', async function() {
            const { userIDs, postIDs, res } = (await setup(1, 2, 0));

            let num_likes = await Like.countDocuments({post_id: postIDs[0]});
            expect(num_likes).to.equal(0);

            let resp = await axios({
                method: "post",
                url: `http://localhost:4350/api/like/likePost`,
                headers: {
                    Authorization: res.data.data.token,
                    withCredentials: true,
                  },
                data: {
                    user_id: userIDs[0],
                    post_id: postIDs[0]
                }
              });

            expect(resp.data.msg).to.equal('success');
            num_likes = await Like.countDocuments({post_id: postIDs[0]});
            expect(num_likes).to.equal(1);

            resp = await axios({
                method: "post",
                url: `http://localhost:4350/api/like/likePost`,
                headers: {
                    Authorization: res.data.data.token,
                    withCredentials: true,
                  },
                data: {
                    user_id: userIDs[1],
                    post_id: postIDs[0]
                }
              });

            expect(resp.data.msg).to.equal('success');
            num_likes = await Like.countDocuments({post_id: postIDs[0]});
            expect(num_likes).to.equal(2);
        });

        it('number of likes should be 1', async function() {
            const { userIDs, postIDs, res } = (await setup(1, 1, 0));

            let num_likes = await Like.countDocuments({post_id: postIDs[0]});
            expect(num_likes).to.equal(0);

            let resp = await axios({
                method: "post",
                url: `http://localhost:4350/api/like/likePost`,
                headers: {
                    Authorization: res.data.data.token,
                    withCredentials: true,
                  },
                data: {
                    user_id: userIDs[0],
                    post_id: postIDs[0]
                }
              });

            expect(resp.data.msg).to.equal('success');
            num_likes = await Like.countDocuments({post_id: postIDs[0]});
            expect(num_likes).to.equal(1);

            resp = await axios({
                method: "post",
                url: `http://localhost:4350/api/like/likePost`,
                headers: {
                    Authorization: res.data.data.token,
                    withCredentials: true,
                  },
                data: {
                    user_id: userIDs[0],
                    post_id: postIDs[0]
                }
              });

            expect(resp.data.msg).to.equal('success');
            num_likes = await Like.countDocuments({post_id: postIDs[0]});
            expect(num_likes).to.equal(1);
        });

        it('should not succeed', async function() {
            const { userIDs, postIDs, res } = (await setup(1, 1, 0));

            await testInvalidIDs(res, 'post', `http://localhost:4350/api/like/likePost`, postIDs[0], userIDs[0], [40000, 40002, 40000, 40003]);
        });
    });

    describe('POST request to unlikePost', function() {

        it('number of likes should be 0', async function() {
            const { userIDs, postIDs, res } = (await setup(1, 1, 1));

            let num_likes = await Like.countDocuments({post_id: postIDs[0]});
            expect(num_likes).to.equal(1);

            let resp = await axios({
                method: "post",
                url: `http://localhost:4350/api/like/unlikePost`,
                headers: {
                    Authorization: res.data.data.token,
                    withCredentials: true,
                  },
                data: {
                    user_id: userIDs[0],
                    post_id: postIDs[0]
                }
              });

            expect(resp.data.msg).to.equal('success');
            num_likes = await Like.countDocuments({post_id: postIDs[0]});
            expect(num_likes).to.equal(0);

            resp = await axios({
                method: "post",
                url: `http://localhost:4350/api/like/unlikePost`,
                headers: {
                    Authorization: res.data.data.token,
                    withCredentials: true,
                  },
                data: {
                    user_id: userIDs[0],
                    post_id: postIDs[0]
                }
              });

            expect(resp.data.msg).to.equal('success');
            num_likes = await Like.countDocuments({post_id: postIDs[0]});
            expect(num_likes).to.equal(0);
        });

        it('number of likes should be 0', async function() {
            const { userIDs, postIDs, res } = (await setup(1, 2, 2));

            let num_likes = await Like.countDocuments({post_id: postIDs[0]});
            expect(num_likes).to.equal(2);

            let resp = await axios({
                method: "post",
                url: `http://localhost:4350/api/like/unlikePost`,
                headers: {
                    Authorization: res.data.data.token,
                    withCredentials: true,
                  },
                data: {
                    user_id: userIDs[0],
                    post_id: postIDs[0]
                }
              });

            expect(resp.data.msg).to.equal('success');
            num_likes = await Like.countDocuments({post_id: postIDs[0]});
            expect(num_likes).to.equal(1);

            resp = await axios({
                method: "post",
                url: `http://localhost:4350/api/like/unlikePost`,
                headers: {
                    Authorization: res.data.data.token,
                    withCredentials: true,
                  },
                data: {
                    user_id: userIDs[1],
                    post_id: postIDs[0]
                }
              });

            expect(resp.data.msg).to.equal('success');
            num_likes = await Like.countDocuments({post_id: postIDs[0]});
            expect(num_likes).to.equal(0);
        });

        it('should not succeed', async function() {
            const { userIDs, postIDs, res } = (await setup(1, 1, 0));

            await testInvalidIDs(res, 'post', `http://localhost:4350/api/like/unlikePost`, postIDs[0], userIDs[0], [40000, 40002, 40000, 40003]);
        });
    });
});