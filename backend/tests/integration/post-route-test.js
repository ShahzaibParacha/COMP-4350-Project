const express = require("express");
const Post = require('../../schema/post-schema');
const User = require('../../schema/user-schema');
const Subscribe = require('../../schema/subscriber-schema')
const subscribeService = require('../../service/subscriber-service')
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
const setup = async (numPosts, numUsers) => {
    let userIDs = [];
    let postIDs = [];
    let i = 0;

    await Post.deleteMany({});

    //generate user ids
    for (i = 0; i < numUsers; i++) {
        userIDs.push(new mongoose.mongo.ObjectID);
    }

    //generate random posts created by numUsers users
    for (i = 0; i < numPosts; i++) {
        postIDs.push(new mongoose.mongo.ObjectID);
        const attrib = {_id: postIDs[postIDs.length - 1], user_id: userIDs[i % numUsers], content: i, post_date: new Date(i * 1000000)};
        await Post.create(attrib);
    }

    //creates an account
    await User.findOneAndDelete({email});
    await User.create({username, email, password, _id: userIDs[0], profile_photo: "/sample_profile.jpg"}); 

    //create a subscribe
    await Subscribe.deleteMany({creator_id: userIDs[0]});
    await Subscribe.deleteMany({audience_id: userIDs[0]});
    await Subscribe.create(new Subscribe({     
      creator_id: userIDs[1],
      audience_id: userIDs[0],
      subscription_date: Date.now(),
      receive_notification: true
    }));

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

describe('Post routes', function () {

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
        await Post.deleteMany({});
        await mongoose.disconnect();
        server.close();
    });

    // this test will change once get_recent_posts paginate
    // also this test does not cover line 75 of post controller
    // I do not know how to make Post.find() throw an exception
    describe('GET request to get_recent_posts', function() {

        it('should return nothing', async function() {
            const token = (await setup(0, 1)).res.data.data.token;

            const res = await axios({
                method: "get",
                url: `http://localhost:4350/api/post/get_recent_posts`,
                headers: {
                    Authorization: token,
                    withCredentials: true,
                  },
              });

            expect(res.data.msg).to.equal('success');
            expect(res.data.data).to.exist;
            expect(res.data.data.length).to.equal(0);
        });

        it('should return all five posts', async function() {
            const token = (await setup(5, 1)).res.data.data.token;

            const res = await axios({
                method: "get",
                url: `http://localhost:4350/api/post/get_recent_posts`,
                headers: {
                    Authorization: token,
                    withCredentials: true,
                  },
              });
            
            expect(res.data.msg).to.equal('success');
            expect(res.data.data).to.exist;
            expect(res.data.data.length).to.equal(5);
        })
    });

    describe('GET request to get_user_posts', function() {

        it('should return nothing', async function() {
            const { id, token } = (await setup(0, 1)).res.data.data;

            const res = await axios({
                method: "get",
                url: `http://localhost:4350/api/post/get_user_posts`,
                headers: {
                    Authorization: token,
                    withCredentials: true,
                  },
                params: {
                    user_id: id,
                },
              });

            expect(res.data.msg).to.equal('success');
            expect(res.data.data).to.exist;
            expect(res.data.data.length).to.equal(0);
        });

        it('should return nothing', async function() {
            const { token } = (await setup(10, 3)).res.data.data;

            const res = await axios({
                method: "get",
                url: `http://localhost:4350/api/post/get_user_posts`,
                headers: {
                    Authorization: token,
                    withCredentials: true,
                  },
                params: {
                    user_id: new mongoose.mongo.ObjectID,
                },
              });

            expect(res.data.msg).to.equal('success');
            expect(res.data.data).to.exist;
            expect(res.data.data.length).to.equal(0);
        });

        it('should not succeed', async function() {
            const { token } = (await setup(10, 3)).res.data.data;

            const res = await axios({
                method: "get",
                url: `http://localhost:4350/api/post/get_user_posts`,
                headers: {
                    Authorization: token,
                    withCredentials: true,
                  },
                params: {
                    user_id: 20,
                },
              });

            expect(res.data.code).to.equal(40002);
        });

        it('should not succeed', async function() {
            const { token } = (await setup(10, 3)).res.data.data;

            const res = await axios({
                method: "get",
                url: `http://localhost:4350/api/post/get_user_posts`,
                headers: {
                    Authorization: token,
                    withCredentials: true,
                  },
                params: {
                    user_id: '20',
                },
              });

            expect(res.data.code).to.equal(40002);
        });

        it('should return all posts with even content', async function() {
            const { id, token } = (await setup(10, 2)).res.data.data;

            const res = await axios({
                method: "get",
                url: `http://localhost:4350/api/post/get_user_posts`,
                headers: {
                    Authorization: token,
                    withCredentials: true,
                  },
                params: {
                    user_id: id,
                },
              });

            expect(res.data.msg).to.equal('success');
            expect(res.data.data).to.exist;
            expect(res.data.data.length).to.equal(5);
            for (let i = 0; i < res.data.data.length; i++) {
                expect(res.data.data[i].post.content % 2).to.equal(0);
            }
        });
    });

    describe('GET request to get_subscribed_posts', function() {

      it('should return nothing', async function() {
        const { id, token } = (await setup(0, 1)).res.data.data;

        const res = await axios({
            method: "get",
            url: `http://localhost:4350/api/post/get_subscribed_posts`,
            headers: {
                Authorization: token,
                withCredentials: true,
              },
            params: {
                user_id: id,
            },
          });

        expect(res.data.msg).to.equal('success');
        expect(res.data.data).to.exist;
        expect(res.data.data.length).to.equal(0);
      });

      it('should return nothing', async function() {
          const { token } = (await setup(10, 3)).res.data.data;

          const res = await axios({
              method: "get",
              url: `http://localhost:4350/api/post/get_subscribed_posts`,
              headers: {
                  Authorization: token,
                  withCredentials: true,
                },
              params: {
                  user_id: new mongoose.mongo.ObjectID,
              },
            });

          expect(res.data.msg).to.equal('success');
          expect(res.data.data).to.exist;
          expect(res.data.data.length).to.equal(0);
      });

      it('should not succeed', async function() {
          const { token } = (await setup(10, 3)).res.data.data;

          const res = await axios({
              method: "get",
              url: `http://localhost:4350/api/post/get_subscribed_posts`,
              headers: {
                  Authorization: token,
                  withCredentials: true,
                },
              params: {
                  user_id: 20,
              },
            });

          expect(res.data.code).to.equal(40002);
      });
    });

    describe('GET request to get_post_by_ID', function() {

      it('should return the post with content of "1"', async function() {
        const { postIDs, res } = (await setup(10, 1));

        const result = await axios({
            method: "get",
            url: `http://localhost:4350/api/post/get_post_by_ID`,
            headers: {
                Authorization: res.data.data.token,
                withCredentials: true,
              },
            params: {
                post_id: postIDs[1],
            },
          });

        const post = result.data.data[0].post;

        expect(result.data.msg).to.equal('success');
        expect(post).to.exist;
        expect(post.content).to.equal('1')
    });

      it('should not find the post with an id of "20"', async function() {
          const { token } = (await setup(10, 2)).res.data.data;

          const res = await axios({
              method: "get",
              url: `http://localhost:4350/api/post/get_post_by_ID`,
              headers: {
                  Authorization: token,
                  withCredentials: true,
                },
              params: {
                  post_id: "20",
              },
            });

          expect(res.data.code).to.equal(40003);
      });

      it('should not find the post with a newly generated id', async function() {
        const { token } = (await setup(10, 2)).res.data.data;

        const res = await axios({
            method: "get",
            url: `http://localhost:4350/api/post/get_post_by_ID`,
            headers: {
                Authorization: token,
                withCredentials: true,
              },
            params: {
                post_id: new mongoose.mongo.ObjectID,
            },
        });

        expect(res.data.data).to.not.exist;
    });

    it('should not find the post with the wrong id type', async function() {
          const { token } = (await setup(10, 2)).res.data.data;

          const res = await axios({
              method: "get",
              url: `http://localhost:4350/api/post/get_post_by_ID`,
              headers: {
                  Authorization: token,
                  withCredentials: true,
                },
              params: {
                  post_id: 2,
              },
            });

          expect(res.data.code).to.equal(40003);
      });
  });

  describe('POST request to update', function() {

        it('should update content from 0 to 69', async function() {
            const { postIDs, res } = (await setup(10, 1));

            await axios({
                method: "post",
                url: `http://localhost:4350/api/post/update`,
                headers: {
                    Authorization: res.data.data.token,
                    withCredentials: true,
                  },
                data: {
                    content: '69',
                    post_id: postIDs[1],
                },
              });

            const post = await Post.findById(postIDs[1]);

            expect(post).to.exist;
            expect(post.content).to.equal('69')
        });

        it('should not update anything', async function() {
            const { token } = (await setup(10, 2)).res.data.data;

            await axios({
                method: "post",
                url: `http://localhost:4350/api/post/update`,
                headers: {
                    Authorization: token,
                    withCredentials: true,
                  },
                data: {
                    post_id: new mongoose.mongo.ObjectID,
                },
              });

            const posts = await Post.find({});

            for (let i = 0; i < posts.length; i++) {
                expect(posts[i].content).to.equal(i + '');
            }
        });

        it('should not succeed', async function() {
            const { token } = (await setup(10, 2)).res.data.data;

            const res = await axios({
                method: "post",
                url: `http://localhost:4350/api/post/update`,
                headers: {
                    Authorization: token,
                    withCredentials: true,
                  },
                data: {
                    post_id: '20',
                },
              });

            expect(res.data.code).to.equal(40003);
        });

        it('should not succeed', async function() {
            const { token } = (await setup(10, 2)).res.data.data;

            const res = await axios({
                method: "post",
                url: `http://localhost:4350/api/post/update`,
                headers: {
                    Authorization: token,
                    withCredentials: true,
                  },
                data: {
                    post_id: 20,
                },
              });

            expect(res.data.code).to.equal(40000);
        });
    });

    describe('DELETE request to update', function() {

        it('should return 9 posts instead of 10', async function() {
            const { postIDs, res } = (await setup(10, 1));

            await axios({
                method: "delete",
                url: `http://localhost:4350/api/post/update`,
                headers: {
                    Authorization: res.data.data.token,
                    withCredentials: true,
                  },
                params: {
                    post_id: postIDs[1],
                },
              });

            const posts = await Post.find({});

            expect(posts).to.exist;
            expect(posts.length).to.equal(9);
            for (let i = 0; i < posts.length; i++) {
                expect(posts[i].content).to.not.equal(1 + '');
            }
        });

        it('should not delete anything', async function() {
            const { res } = (await setup(10, 1));

            await axios({
                method: "delete",
                url: `http://localhost:4350/api/post/update`,
                headers: {
                    Authorization: res.data.data.token,
                    withCredentials: true,
                  },
                params: {
                    post_id: new mongoose.mongo.ObjectID,
                },
              });

            const posts = await Post.find({});

            expect(posts).to.exist;
            expect(posts.length).to.equal(10);
            for (let i = 0; i < posts.length; i++) {
                expect(posts[i].content).to.equal(i + '');
            }
        });

        it('should not succeed', async function() {
            const { res } = (await setup(10, 1));

            const response = await axios({
                method: "delete",
                url: `http://localhost:4350/api/post/update`,
                headers: {
                    Authorization: res.data.data.token,
                    withCredentials: true,
                  },
                params: {
                    post_id: '20',
                },
              });

            expect(response.data.code).to.equal(40003);
        });

        it('should not succeed', async function() {
            const { res } = (await setup(10, 1));

            const response = await axios({
                method: "delete",
                url: `http://localhost:4350/api/post/update`,
                headers: {
                    Authorization: res.data.data.token,
                    withCredentials: true,
                  },
                params: {
                    post_id: 20,
                },
              });

            expect(response.data.code).to.equal(40003);
        });
     });

    describe('POST request to create', function() {

        it('should return a post', async function() {
            const { userIDs, res } = (await setup(0, 1));

            await axios({
                method: "post",
                url: `http://localhost:4350/api/post/create`,
                headers: {
                    Authorization: res.data.data.token,
                    withCredentials: true,
                  },
                data: {
                    content: '69',
                    user_id: userIDs[0],
                },
              });

            const posts = await Post.find({user_id: userIDs[0]});

            expect(posts).to.exist;
            expect(posts.length).to.equal(1);
            expect(posts[0].content).to.equal('69');
        });

        it('should return three posts', async function() {
            const { userIDs, res } = (await setup(4, 2));

            await axios({
                method: "post",
                url: `http://localhost:4350/api/post/create`,
                headers: {
                    Authorization: res.data.data.token,
                    withCredentials: true,
                  },
                data: {
                    content: '4',
                    user_id: userIDs[0],
                },
              });

            const posts = await Post.find({user_id: userIDs[0]});

            expect(posts).to.exist;
            expect(posts.length).to.equal(3);
            for (let i = 0; i < posts.length; i++) {
                expect(posts[i].content).to.equal(i * 2 + '');
            }
        });

        it('should not succeed', async function() {
            const { res } = (await setup(5, 1));

            const response = await axios({
                method: "post",
                url: `http://localhost:4350/api/post/create`,
                headers: {
                    Authorization: res.data.data.token,
                    withCredentials: true,
                  },
                data: {
                    content: '69',
                    user_id: '20',
                },
              });

            expect(response.data.code).to.equal(40002);
        });

        it('should not succeed', async function() {
            const { res } = (await setup(5, 1));

            const response = await axios({
                method: "post",
                url: `http://localhost:4350/api/post/create`,
                headers: {
                    Authorization: res.data.data.token,
                    withCredentials: true,
                  },
                data: {
                    content: '69',
                    user_id: 20,
                },
              });

            expect(response.data.code).to.equal(40000);
        });
     });
});