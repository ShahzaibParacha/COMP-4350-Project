// import React, { useEffect, useState } from "react";
import React, { useEffect, useState } from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import ReactMarkdown from "react-markdown";
// eslint-disable-next-line import/no-extraneous-dependencies
import remarkGfm from "remark-gfm";
import axios from "axios";
import { useParams } from "react-router-dom";
import Comment from "../comment/Comment";
import useAuthContext from "../../hooks/useAuthContext";
import { fromContextToSession, fromSessionToContext } from "../../util/state";

function ViewPost() {
  const [post, setPost] = useState();
  const { id } = useParams();
  const { userId: contextId, token: contextToken, dispatch } = useAuthContext();
  const { userId, token } = JSON.parse(sessionStorage.getItem("session"));

  useEffect(() => {
    // eslint-disable-next-line no-console
    axios
      .get(`http://localhost:4350/api/post/get_post_by_ID`, {
        params: { post_id: id },
        headers: {
          Authorization: token,
          withCredentials: true,
        },
      })
      .then((r) => {
        // eslint-disable-next-line no-console
        console.log(r.data.data.content);
        setPost(r.data.data.content);
      })
      // eslint-disable-next-line no-console
      .catch((e) => console.error(e, userId));
  }, []);

  useEffect(() => {
    fromContextToSession(contextId, contextToken);
  }, [contextId]);

  useEffect(() => {
    fromSessionToContext(userId, token, dispatch);
  }, []);

  return (
    <div className="bg-base-100 h-fit min-h-screen pb-16">
      <div className="grid grid-rows-4 grid-cols-8 gap-4">
        <div className="row-start-1 row-end-5 bg-black-600 row-span-2" />
        <div className="row-start-1 col-start-3 bg-base-100 col-span-4 row-end-5">
          <div className="grid-column-1 pt-48">
            <div className="pt-4">
              <div>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {post}
                </ReactMarkdown>
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
