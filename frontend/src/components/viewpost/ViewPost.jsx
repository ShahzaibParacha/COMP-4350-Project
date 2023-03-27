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
  const { id } = useParams();
  const navigate = useNavigate();
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
        setUsername(r.data.data[0].username);
        setProfile(r.data.data[0].post.user_id);
        setPhoto(r.data.data[0].profile_photo);
        setPost(r.data.data[0].post.content);
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

  return (
    <div className="bg-base-100 h-fit min-h-screen pb-16">
      <div className="grid grid-rows-4 grid-cols-8 gap-4">
        <div className="row-start-1 row-end-5 bg-black-600 row-span-2" />
        <div className="row-start-1 col-start-3 bg-base-100 col-span-4 row-end-5">
          <div className="grid-column-1 pt-16">
            <div className="pt-2">
              <div className="flex pb-4 items-center">
                <button type="button" onClick={profileClick}>
                  <div className="flex justify-center">
                    <img
                      className="rounded-full h-[calc(8rem*0.5)] w-[calc(8rem*0.5)] object-cover"
                      src={photo === null ? "/sample_profile.jpg" : photo}
                      alt="Profile"
                    />
                  </div>
                </button>
                <h2 className="ml-4">{username} posted</h2>
              </div>
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
