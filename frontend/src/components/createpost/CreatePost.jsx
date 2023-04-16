import React, { useState, useEffect } from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import MDEditor from "@uiw/react-md-editor";
// eslint-disable-next-line
import rehypeSanitize from "rehype-sanitize";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuthContext from "../../hooks/useAuthContext";
import { fromContextToSession, fromSessionToContext } from "../../util/state";

function CreatePost() {
  const [post, createPost] = useState("Start writing...");
  const { userId: contextId, token: contextToken, dispatch } = useAuthContext();
  const { userId, token } = JSON.parse(sessionStorage.getItem("session"));

  const navigate = useNavigate();

  useEffect(() => {
    fromContextToSession(contextId, contextToken);
  }, [contextId]);

  useEffect(() => {
    document.documentElement.setAttribute("data-color-mode", "dark");
    fromSessionToContext(userId, token, dispatch);
  }, []);

  const handlePostCreation = (e) => {
    e.preventDefault();
    // eslint-disable-next-line no-console
    // console.log(post);

    axios({
      method: "post",
      url: `http://localhost:4350/api/post/create`,
      headers: {
        Authorization: token,
        withCredentials: true,
      },
      data: {
        user_id: userId,
        content: post,
      },
    })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
      })
      .then((res) => {
        // eslint-disable-next-line no-console
        if (res.data.msg === "success") {
          navigate(`/writer/${userId}`);
        }
      });
  };

  return (
    <div className="bg-base-100">
      <div className="grid grid-rows-4 grid-cols-6 gap-4">
        {/* <div className="row-start-1 row-end-5 bg-black-600 row-span-2" /> */}
        <div className="row-start-1 col-start-2 bg-base-100 col-span-4 row-end-5">
          <div className="grid-column-1 pt-16">
            <div className="flex justify-end">
              <button
                type="submit"
                className="group w-48 h-12  rounded-md border border-transparent bg-neutral py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={handlePostCreation}
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3" />
                Submit
              </button>
            </div>

            <div className="my-4 h-fit min-h-screen bg-base-100">
              <MDEditor
                value={post}
                className="h-screen"
                onChange={createPost}
                height={690}
                previewOptions={{
                  rehypePlugins: [[rehypeSanitize]],
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePost;
