import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Writer() {
  const sessionUserID = sessionStorage.getItem("session_user_id");
  const sessionJWT = sessionStorage.getItem("session_jwt");
  const [writer, setWriter] = useState({});
  const [page, setPage] = useState("profile");

  useEffect(() => {
    axios
      .get(`http://0.0.0.0:4350/api/user/profile`, {
        params: { user_id: sessionUserID },
        headers: {
          Authorization: sessionJWT,
          withCredentials: true,
        },
      })
      .then((r) => {
        sessionStorage.setItem("username", r.data.data.username);
        setWriter(r.data.data);
      })
      // eslint-disable-next-line no-console
      .catch((e) => console.error(e, writer));
  }, [writer.username]);

  function handlePageChange() {
    if (page === "profile") {
      setPage("preferences");
    } else if (page === "preferences") {
      setPage("profile");
    }
  }

  function renderPreferences() {
    return (
      <div className="grid-rows-1 h-25">
        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
        <button
          id="profile"
          type="button"
          className="rounded-md bg-neutral px-5 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={handlePageChange}
        >
          Back to profile
        </button>
        <div>
          <h1 className="mt-8 text-2xl font-bold ml-12 text-center text-simple font-base tracking-tight text-black-800 sm:text-5xl">
            {`${
              writer.username
                ? writer.username
                : sessionStorage.getItem("username")
            }'s`}{" "}
            Preferences
          </h1>
        </div>
      </div>
    );
  }

  function renderProfile() {
    return (
      <div>
        <div className="grid-rows-1 h-25">
          <button
            id="preferences"
            type="button"
            className="rounded-md bg-neutral px-5 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={handlePageChange}
          >
            Manage Preferences
          </button>
          <div>
            <h1 className="mt-8 text-2xl font-bold ml-12 text-center text-simple font-base tracking-tight text-black-800 sm:text-5xl">
              {`${
                writer.username
                  ? writer.username
                  : sessionStorage.getItem("username")
              }'s`}{" "}
              Profile
            </h1>
          </div>
          <Link
            to={`../writer/${sessionStorage.getItem("session_user_id")}/write`}
            type="button"
            className="rounded-md bg-neutral px-5 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Create a post
          </Link>
        </div>
        <div className="grid grid-rows-4 grid-cols-6 gap-4">
          <div className="row-start-1 row-end-5 bg-black-600 row-span-2 h-screen" />
          <div className="row-start-1 col-start-2 col-span-4 row-end-5 h-screen">
            <div className="grid-column-1" />
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-simple sm:text-5xl">
              Placeholder
            </h1>
          </div>
          <div className="row-start-1 row-end-5 h-screen" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-base-100">
      {page === "profile" ? renderProfile() : renderPreferences()}
    </div>
  );
}

export default Writer;
