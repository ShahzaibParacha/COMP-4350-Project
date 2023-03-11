// import React, { useEffect, useState } from "react";
import React, { useEffect } from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import ReactMarkdown from "react-markdown";
// eslint-disable-next-line import/no-extraneous-dependencies
import remarkGfm from "remark-gfm";
import Comment from "../comment/Comment";
import useAuthContext from "../../hooks/useAuthContext";
import { fromContextToSession, fromSessionToContext } from "../../util/state";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import useAuthContext from "../../hooks/useAuthContext";

function ViewPost() {
  // const [post, setPost] = useState();
  // const { userId, token } = useAuthContext();
  // const { postID } = useParams();
  const { userId: contextId, token: contextToken, dispatch } = useAuthContext();
  const { userId, token } = JSON.parse(sessionStorage.getItem("session"));

  // useEffect(() => {
  //   axios
  //     .get(`http://localhost:4350/api/post/get_post_by_ID`, {
  //       params: { user_id: userId, post_ID: postID },
  //       headers: {
  //         Authorization: token,
  //         withCredentials: true,
  //       },
  //     })
  //     .then((r) => {
  //       // eslint-disable-next-line no-console
  //       console.log(r.data);
  //       setPost(r.data.data.post);
  //     })
  //     // eslint-disable-next-line no-console
  //     .catch((e) => console.error(e, userId));
  // }, []);

  // eslint-disable-next-line no-console
  // console.log(post);

  useEffect(() => {
    fromContextToSession(contextId, contextToken);
  }, [contextId]);

  useEffect(() => {
    fromSessionToContext(userId, token, dispatch);
  }, []);

  const postData = {
    postID: "6400e5124d00ab9cfa260998",
    authorName: "FirstName LastName",
    authorOccupation: "Occupation",
    text: `# Fugiat 
    
    ipsum **ipsum** deserunt culpa aute sint do nostrud anim incididunt cillum culpa consequat.
    Excepteur qui ipsum aliquip consequat sint. Sit id mollit nulla mollit nostrud in ea officia proident.
    Irure nostrud pariatur mollit ad adipisicing reprehenderit deserunt qui eu.`,
  };
  const markdown = `Just a link: https://reactjs.com.`;

  return (
    <div className="bg-base-100 h-fit min-h-screen pb-16">
      <div className="grid grid-rows-4 grid-cols-6 gap-4">
        <div className="row-start-1 row-end-5 bg-black-600 row-span-2" />
        <div className="row-start-1 col-start-2 bg-base-100 col-span-4 row-end-5">
          <div className="grid-column-1 pt-48">
            <div className="container pt-4">
              <div>
                <h1>ViewPost</h1>
                <ReactMarkdown
                  /* eslint-disable-next-line react/no-children-prop */
                  children={postData.text}
                  remarkPlugins={[remarkGfm]}
                />
                {/* <ReactMarkdown */}
                {/*  /* eslint-disable-next-line react/no-children-prop */}
                {/*  children={post.text} */}
                {/*  remarkPlugins={[remarkGfm]} */}
                {/* /> */}
                <ReactMarkdown>*React-Markdown* is **Awesome**</ReactMarkdown>
                <ReactMarkdown
                  /* eslint-disable-next-line react/no-children-prop */
                  children={markdown}
                  remarkPlugins={[remarkGfm]}
                />
                <Comment id={postData.postID} />
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
