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
      url: `http://localhost:4350/api/post/getRecommendedPosts`,
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
          className="w-full my-4 rounded-2xl text-left border font-base bg-gray-50 shadow-xl ease-in duration-200 hover:shadow-xxl hover:border-purple-800 border-black border-1 transform hover:scale-x-[1.02]"
        >
          <div className="bg-gray-50 rounded-2xl py-4 sm:grid sm:grid-cols-6 sm:gap-4">
            <div className="flex justify-center items-center">
              <div className="col-span-1">
                <button
                  type="button"
                  onClick={() => profileClick(post.post.user_id)}
                  className="flex justify-center"
                >
                  <div className="justify-center">
                    <img
                      className="h-[calc(8rem*1)] w-[calc(8rem*1)] object-cover enlarge-sm"
                      src={
                        post.profile_photo === null
                          ? "/sample_profile.jpg"
                          : post.profile_photo
                      }
                      alt="Profile"
                    />
                  </div>
                </button>
                <h3 className="text-sm flex justify-center font-base font-medium leading-6 text-gray-900">
                  {post.username.length > 10
                    ? `${post.username.substring(0, 10)}...`
                    : post.username}
                </h3>
                <div className="mt-1 flex justify-center font-base max-w-2xl pt-1 text-sm text-gray-500">
                  <p className="pt-1 pr-1">{post.numberLikes}</p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    strokeWidth="1.0"
                    stroke="currentColor"
                    className={
                      post.numberLikes > 0
                        ? "w-6 h-6 fill-purple-900 stroke-none"
                        : "w-6 h-6 fill-none stroke-black"
                    }
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handlePostClick(post.post._id)}
              className="border-l border-neutral px-4 py-2 col-start-2 col-span-5 sm:px-6"
            >
              <div className="bg-gray-50 px-6 py-5 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-6">
                <dd className="mt-1 text-left text-xl font-bold font-base text-gray-900 sm:col-span-6 sm:mt-0 ">
                  {post.post.content.length > 0
                    ? removeMd(post.post.content.split("\n")[0])
                    : `${removeMd(post.post.content.substring(0, 270))}...`}
                </dd>
                <dd className="mt-1 text-left text-md font-base text-gray-900 sm:col-span-6 sm:mt-0 ">
                  {post.post.content.length > 0
                    ? removeMd(post.post.content.split("\n")[1])
                    : `${removeMd(post.post.content.substring(0, 300))}...`}
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
