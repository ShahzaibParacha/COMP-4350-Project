import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// eslint-disable-next-line import/no-extraneous-dependencies
import removeMd from "remove-markdown";

function WidePost() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const { token } = JSON.parse(sessionStorage.getItem("session"));

  const getPosts = () => {
    axios({
      method: "get",
      url: `http://localhost:4350/api/post/get_recent_posts`,
      headers: {
        Authorization: token,
        withCredentials: true,
      },
    }).then((s) => {
      setPosts(s.data.data);
    });
  };

  useEffect(() => {
    getPosts();
  }, []);

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
                  <div className="flex justify-center">
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
                <h3 className="text-lg font-base font-medium leading-6 text-gray-900">
                  {post.username.length > 10
                    ? `${post.username.substring(0, 10)}...`
                    : post.username}
                </h3>
                <p className="mt-1 overflow-hidden font-base max-w-2xl text-sm text-gray-500">
                  {post.affiliation && post.affiliation.length > 10
                    ? `${post.affiliation.substring(0, 10)}...`
                    : post.affiliation}
                </p>
                <p className="mt-1 border-t font-base max-w-2xl text-sm text-gray-500">
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
                <dd className="mt-1 text-left text-sm font-base text-gray-900 sm:col-span-6 sm:mt-0">
                  {removeMd(post.post.content)}
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
