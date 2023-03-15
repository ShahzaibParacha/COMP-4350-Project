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

  return (
    <div>
      {posts.map((post) => (
        <button
          type="button"
          className="overflow-hidden w-full rounded-lg text-left font-base bg-white m-6 shadow-2xl px-6 sm:rounded-m"
          onClick={() => handlePostClick(post.post._id)}
          key={post.post._id}
        >
          <div className="bg-gray-50 px-6 py-5 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-6">
            <div className="px-4 py-2 col-start-1 col-end-2 sm:px-6">
              <h3 className="text-lg font-base font-medium leading-6 text-gray-900">
                {post.username}
              </h3>
              <p className="mt-1 font-base max-w-2xl text-sm text-gray-500">
                {post.affiliation}
              </p>
              <p className="mt-1 border-t font-base max-w-2xl text-sm text-gray-500">
                {post.numberLikes === 1
                  ? `${post.numberLikes} Like`
                  : `${post.numberLikes} Likes`}
              </p>
            </div>
            <div className="px-4 py-2 col-start-2 col-span-5 sm:px-6">
              <div className="border-l border-neutral">
                <div className="bg-gray-50 px-6 py-5 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-6">
                  <dd className="mt-1 text-sm font-base text-gray-900 sm:col-span-6 sm:mt-0">
                    {removeMd(post.post.content)}
                  </dd>
                </div>
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

export default WidePost;
