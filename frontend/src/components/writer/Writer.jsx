import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Writer() {
  const sessionUserID = sessionStorage.getItem("session_user_id");
  const sessionJWT = sessionStorage.getItem("session_jwt");
  const [writer, setWriter] = useState({});
  const [page, setPage] = useState("profile");
  const navigate = useNavigate();

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

  function handleDeletion() {
    axios
      .get(`http://0.0.0.0:4350/api/user/delete_account`, {
        params: { user_id: sessionUserID },
        headers: {
          Authorization: sessionJWT,
          withCredentials: true,
        },
      })
      .then((r) => {
        if (r.data.msg === "success") {
          sessionStorage.clear();
          navigate("../login");
        }
      })
      // eslint-disable-next-line no-console
      .catch((e) => console.error(e, writer));
  }

  function renderPreferences() {
    return (
      <div>
        <div className="grid-rows-1 h-48">
          <div className="row-start-1 col-start-2 col-span-4 row-end-5 h-screen">
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
        <div className="grid grid-rows-4 grid-cols-6 gap-4">
          <div className="row-start-1 justify-items-center row-end-5 bg-black-600 row-span-2 h-screen">
            <button
              id="preferences"
              type="button"
              className=" bg-base-100 w-9/12 text-center text-simple border-neutral border-2 hover:bg-neutral hover:text-white px-5 py-3.5 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={handlePageChange}
            >
              Return to Profile
            </button>
          </div>
          <div className="row-start-1 col-start-2 col-span-4 row-end-5 h-screen">
            <div className="grid-column-1">
              <h1 className="mt-4 pl-4 text-2xl text-left font-bold border-b pb-4 tracking-tight text-simple sm:text-5xl">
                Delete Account
              </h1>
              <div className="flex justify-left">
                <p className="w-6/12 pl-4 text-left pt-4">
                  If you would like to delete your account, click on the button
                  on the right. We store none of your data when you leave. Once
                  deleted, the only way back is to create a new account.
                </p>
                <div className="w-6/12 flex justify-center">
                  <button
                    className="rounded-md bg-neutral px-5 py-3.5 text-sm mt-6 font-semibold text-white shadow-sm hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    type="button"
                    onClick={handleDeletion}
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="row-start-1 row-end-5 h-screen" />
        </div>
      </div>
    );
  }

  function renderProfile() {
    return (
      <div>
        <div className="grid-rows-1 h-48">
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
        </div>
        <div className="grid grid-rows-4 grid-cols-6 gap-4">
          <div className="row-start-1 justify-items-center row-end-5 bg-black-600 row-span-2 h-screen">
            <Link
              to={`../writer/${sessionStorage.getItem(
                "session_user_id"
              )}/write`}
              type="button"
              className=" bg-base-100 w-9/12 text-center text-simple border-neutral border-2 hover:bg-neutral hover:text-white px-5 py-3.5 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Create a post
            </Link>
            <button
              id="preferences"
              type="button"
              className=" bg-base-100 w-9/12 text-center border-t-0 text-simple border-neutral border-2 hover:bg-neutral hover:text-white px-5 py-3.5 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={handlePageChange}
            >
              Manage Preferences
            </button>
          </div>
          <div className="row-start-1 col-start-2 col-span-4 row-end-5 h-screen">
            <div className="grid-column-1">
              <h1 className="mt-4 text-2xl text-center font-bold border-b pb-4 tracking-tight text-simple sm:text-5xl">
                Bio
              </h1>
              <div className="flex justify-center">
                <p className="w-[40rem] text-center pt-4">
                  {/* eslint-disable-next-line react/no-unescaped-entities */}
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident,
                  {/* eslint-disable-next-line react/no-unescaped-entities */}
                  sunt in culpa qui officia deserunt mollit anim id est labor."
                </p>
              </div>

              <h1 className="mt-4 text-2xl pt-20 text-center font-bold border-b pb-4 tracking-tight text-simple sm:text-5xl">
                Affiliation
              </h1>
              <div className="flex justify-center">
                <p className="w-[40rem] text-center pt-4">Something</p>
              </div>
            </div>

            <h1 className="mt-4 text-2xl pt-20 text-center font-bold border-b pb-4 tracking-tight text-simple sm:text-5xl">
              Recommendations
            </h1>
            <div className="flex w-[40rem] pt-4 justify-center">
              <ul className="list-disc">
                <li>one</li>
                <li>two</li>
              </ul>
            </div>
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
