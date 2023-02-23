import React, { useState } from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import MDEditor from "@uiw/react-md-editor";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuthContext from "../../hooks/useAuthContext";

function CreatePost() {
  const [post, createPost] = useState("Start writing...");
  const { userId, token } = useAuthContext();
  const navigate = useNavigate();

  const handlePostCreation = (e) => {
    e.preventDefault();
    // eslint-disable-next-line no-console
    console.log(post);

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
        <div className="row-start-1 row-end-5 bg-black-600 row-span-2 h-screen" />
        <div className="row-start-1 col-start-2 bg-base-100 col-span-4 row-end-5 h-screen">
          <div className="grid-column-1 h-screen pt-48">
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

            <div className="container pt-4">
              <MDEditor
                value={post}
                className="h-screen"
                onChange={createPost}
                height={1080}
                maxHeight={1200}
              />
              {/* <MDEditor.Markdown source={value} /> */}
            </div>
          </div>
        </div>
        <div className="row-start-1 row-end-5 h-screen" />
      </div>
    </div>
  );
}

export default CreatePost;
