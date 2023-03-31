import React, { useState, useEffect } from "react";
import WidePost from "../widepost/WidePost";
import useAuthContext from "../../hooks/useAuthContext";
import { fromContextToSession, fromSessionToContext } from "../../util/state";

function Home() {
  const [postType, setPostType] = useState("feed");
  const { userId: contextId, token: contextToken, dispatch } = useAuthContext();
  const { userId, token } = JSON.parse(sessionStorage.getItem("session"));

  useEffect(() => {
    fromContextToSession(contextId, contextToken);
  }, [contextId]);

  useEffect(() => {
    fromSessionToContext(userId, token, dispatch);
  }, []);

  const feedButtonClick = (e) => {
    e.preventDefault();
    if (e.target.id === "feed") {
      setPostType("feed");
      e.target.classList.remove("bg-purple-100", "text-gray-800");
      e.target.classList.add("bg-neutral", "text-white");
      document
        .getElementById("subscribed")
        .classList.add("bg-purple-100", "text-gray-800");
      document
        .getElementById("subscribed")
        .classList.remove("bg-neutral", "text-white");
    } else if (e.target.id === "subscribed") {
      setPostType("subscribed");
      e.target.classList.remove("bg-purple-100", "text-gray-800");
      e.target.classList.add("bg-neutral", "text-white");
      document
        .getElementById("feed")
        .classList.add("bg-purple-100", "text-gray-800");
      document
        .getElementById("feed")
        .classList.remove("bg-neutral", "text-white");
    }
  };

  return (
    <div>
      <div className="grid grid-rows-4 grid-cols-6 gap-4">
        <div className="row-start-1 row-end-5 bg-black-600 row-span-2 h-screen" />
        <div className="row-start-1 col-start-2 col-span-4 row-end-5 h-screen">
          <div className="flex justify-center pt-24">
            <button
              type="button"
              onClick={feedButtonClick}
              id="feed"
              className="w-64 h-12 bg-neutral text-white rounded-full font-bold py-2 px-4 rounded-r"
            >
              Feed
            </button>
            <button
              type="button"
              onClick={feedButtonClick}
              id="subscribed"
              className="bg-purple-100 w-64 h-12 hover:bg-neutral hover:text-white rounded-full text-gray-800 font-bold py-2 px-4 rounded-l"
            >
              Recommended
            </button>
          </div>
          <div className="grid-column-1" />
          <WidePost postType={postType} />
        </div>
        <div className="row-start-1 row-end-5 h-screen" />
      </div>
    </div>
  );
}

export default Home;
