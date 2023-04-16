// import React, { useEffect, useState } from "react";
import React, { useEffect, useState } from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import ReactMarkdown from "react-markdown";
// eslint-disable-next-line import/no-extraneous-dependencies
import remarkGfm from "remark-gfm";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Comment from "../comment/Comment";
import useAuthContext from "../../hooks/useAuthContext";
import { fromContextToSession, fromSessionToContext } from "../../util/state";

function ViewPost() {
  const [profile, setProfile] = useState();
  const [photo, setPhoto] = useState();
  const [post, setPost] = useState();
  const [username, setUsername] = useState();
  const [date, setDate] = useState();
  const { id } = useParams();
  const navigate = useNavigate();
  const { userId: contextId, token: contextToken, dispatch } = useAuthContext();
  const { userId, token } = JSON.parse(sessionStorage.getItem("session"));

  const deletePost = () => {
    axios
      .delete(`http://localhost:4350/api/post/update`, {
        params: { post_id: id },
        headers: {
          Authorization: token,
          withCredentials: true,
        },
      })
      .then((r) => {
        if (r.data.code === 20000) {
          navigate("../");
        }
      });
  };

  function showDeleteModal() {
    document.getElementById("delete_modal").style.display = "block";
  }

  function hideDeleteModal() {
    document.getElementById("delete_modal").style.display = "none";
  }

  useEffect(() => {
    // eslint-disable-next-line no-console
    axios
      .get(`http://localhost:4350/api/post/getPostByID`, {
        params: { post_id: id },
        headers: {
          Authorization: token,
          withCredentials: true,
        },
      })
      .then((r) => {
        setUsername(r.data.data[0].username);
        setProfile(r.data.data[0].post.user_id);
        setPhoto(r.data.data[0].profile_photo);
        setPost(r.data.data[0].post.content);
        setDate(r.data.data[0].post.post_date);
      })
      .catch((e) => console.error(e, userId));
  }, []);

  useEffect(() => {
    fromContextToSession(contextId, contextToken);
  }, [contextId]);

  useEffect(() => {
    fromSessionToContext(userId, token, dispatch);
  }, []);

  const profileClick = () => {
    navigate(`/writer/${profile}`);
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="bg-base-100 h-fit min-h-screen pb-16">
      <div
        className="relative z-10 hidden"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
        id="delete_modal"
      >
        <div className="fixed inset-0 transition-opacity" />
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      className="h-6 w-6 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="font-bond leading-6" id="modal-title">
                      Delete Post
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm">
                        Are you sure you want to delete this post?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={deletePost}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={hideDeleteModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-rows-4 grid-cols-8 gap-4">
        <div className="row-start-1 row-end-5 bg-black-600 row-span-2" />
        <div className="row-start-1 col-start-3 bg-base-100 col-span-4 row-end-5">
          <div className="grid-column-1 pt-16">
            <div className="pt-2">
              <div className="flex pb-4 items-center">
                <button type="button" onClick={profileClick}>
                  <div className="flex justify-center">
                    <img
                      className="rounded-full h-[calc(8rem*0.5)] w-[calc(8rem*0.5)] object-cover enlarge-sm"
                      src={photo === null ? "/sample_profile.jpg" : photo}
                      alt="Profile"
                    />
                  </div>
                </button>
                <h2 className="ml-4">{username} posted</h2>
              </div>
              <div className="mb-10 flex justify-between">
                <p className="font-bold">
                  Written on{" "}
                  {`${months[new Date(date).getMonth()]} ${new Date(
                    date
                  ).getDate()}, ${new Date(date).getFullYear()}`}
                </p>
                <div className="px-auto">
                  {profile === userId && (
                    <button
                      type="button"
                      className="rounded-md hover:bg-red-700 bg-neutral text-white p-2 w-fit"
                      onClick={showDeleteModal}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
              <div>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {post}
                </ReactMarkdown>
                <div className="bg-gray-400 rounded-[5px] w-[80%] h-[4.2px] mx-auto mt-8" />
                <Comment id={id} />
              </div>
            </div>
          </div>
        </div>
        <div className="row-start-1 row-end-5 h-screen" />
      </div>
    </div>
  );
}

export default ViewPost;
