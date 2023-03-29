import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";
// eslint-disable-next-line import/no-extraneous-dependencies
import removeMd from "remove-markdown";

function WidePost({ postType }) {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const { userId, token } = JSON.parse(sessionStorage.getItem("session"));

  const getRecommendedPosts = () => {
    axios({
      method: "get",
      url: `http://localhost:4350/api/post/getRecommendatedPosts`,
      params: { user_id: userId },
      headers: {
        Authorization: token,
        withCredentials: true,
      },
    }).then((s) => {
      setPosts(s.data.data);
    });
  };

  const getRecentPosts = () => {
    axios({
      method: "get",
      url: `http://localhost:4350/api/post/getRecentPosts`,
      headers: {
        Authorization: token,
        withCredentials: true,
      },
    }).then((s) => {
      setPosts(s.data.data);
    });
  };

  const getPosts = () => {
    if (postType === "feed") {
      getRecentPosts();
    } else if (postType === "subscribed") {
      getRecommendedPosts();
    }
  };
  useEffect(() => {
    getPosts();
  }, [postType]);

  const handlePostClick = (postID) => {
    navigate(`/post/${postID}`);
  };

  const profileClick = (profile) => {
    navigate(`/writer/${profile}`);
  };

  return (
    <div>
      {posts.map((post) => (
        <div
          key={post.post._id}
          className="w-full my-4 rounded-2xl text-left border font-base bg-gray-50 shadow-xl"
        >
          <div className="bg-gray-50 rounded-2xl py-4 sm:grid sm:grid-cols-6 sm:gap-4">
            <div className="flex justify-center items-center">
              <div className="col-span-1">
                <button
                  type="button"
                  onClick={() => profileClick(post.post.user_id)}
                >
                  <div>
                    <img
                      className="rounded-full h-[calc(8rem*0.5)] w-[calc(8rem*0.5)] object-cover"
                      src={
                        post.profile_photo === null
                          ? "/sample_profile.jpg"
                          : post.profile_photo
                      }
                      alt="Profile"
                    />
                  </div>
                </button>
                <p className="text-[0.69rem] font-base font-medium leading-6 text-gray-900">
                  {post.username.length > 15
                    ? `${post.username.substring(0, 15)}...`
                    : post.username}
                </p>
                <p className="mt-1 font-base max-w-2xl text-[0.6rem] text-gray-500">
                  {post.numberLikes === 1
                    ? `${post.numberLikes} Like`
                    : `${post.numberLikes} Likes`}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handlePostClick(post.post._id)}
              className="border-l border-neutral px-4 py-2 col-start-2 col-span-5 sm:px-6"
            >
              <div className="bg-gray-50 px-6 py-5 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-6">
                <dd className="mt-1 text-left text-sm font-base text-gray-900 sm:col-span-6 sm:mt-0 overflow-x-hidden">
                  {post.post.content.length > 200
                    ? removeMd(`${post.post.content.substring(0, 200)}...`)
                    : removeMd(post.post.content)}
                </dd>
              </div>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default WidePost;

WidePost.propTypes = {
  // can keep this since it is up to preference according to the doc
  // eslint-disable-next-line
  postType: PropTypes.any,
};
