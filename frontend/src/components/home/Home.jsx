import React, { useEffect } from "react";
import WidePost from "../widepost/WidePost";
import useAuthContext from "../../hooks/useAuthContext";
import { fromContextToSession, fromSessionToContext } from "../../util/state";

function Home() {
  const { userId: contextId, token: contextToken, dispatch } = useAuthContext();
  const { userId, token } = JSON.parse(sessionStorage.getItem("session"));

  useEffect(() => {
    fromContextToSession(contextId, contextToken);
  }, [contextId]);

  useEffect(() => {
    fromSessionToContext(userId, token, dispatch);
  }, []);

  return (
    <div>
      <div className="grid grid-rows-4 grid-cols-6 gap-4">
        <div className="row-start-1 row-end-5 bg-black-600 row-span-2 h-screen" />
        <div className="row-start-1 col-start-2 col-span-4 row-end-5 h-screen">
          <h1 className="mt-8 text-xl font-bold ml-12 font-base tracking-tight text-black-800 sm:text-5xl">
            Your Feed
          </h1>
          <div className="grid-column-1" />
          <WidePost />
          <WidePost />
        </div>
        <div className="row-start-1 row-end-5 h-screen" />
      </div>
    </div>
  );
}

export default Home;
