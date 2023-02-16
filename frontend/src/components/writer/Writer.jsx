import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Writer() {
  const sessionUserID = sessionStorage.getItem("session_user_id");
  const sessionJWT = sessionStorage.getItem("session_jwt");

  const [page, setPage] = useState("profile");
  const navigate = useNavigate();

  const [changeUsername, isChangingUsername] = useState(false);
  const [changePassword, isChangingPassword] = useState(false);
  const [changeBio, isChangingBio] = useState(false);
  const [changeAffiliation, isChangingAffiliation] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [affiliation, setAffiliation] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:4350/api/user/profile`, {
        params: { user_id: sessionUserID },
        headers: {
          Authorization: sessionJWT,
          withCredentials: true,
        },
      })
      .then((r) => {
        sessionStorage.setItem("user", r.data.data);
        setUsername(r.data.data.username);
        setBio(r.data.data.bio);
        setAffiliation(r.data.data.affiliation);
      })
      // eslint-disable-next-line no-console
      .catch((e) => console.error(e, username));
  }, [username, password, bio, affiliation]);

  function handlePageChange() {
    if (page === "profile") {
      setPage("preferences");
    } else if (page === "preferences") {
      setPage("profile");
    }
  }

  function handleDeletion() {
    axios
      .get(`http://localhost:4350/api/user/delete_account`, {
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
      .catch((e) => console.error(e, username));
  }

  function switchUsername(e) {
    e.preventDefault();
    const usernameInput = document.getElementById("username_input");

    if (changeUsername) {
      // if we clicked the button and the text box is there, then we submit
      if (usernameInput.value.length > 0) {
        axios({
          method: "post",
          url: `http://localhost:4350/api/user/username`,
          headers: {
            Authorization: sessionJWT,
            withCredentials: true,
          },
          data: {
            user_id: sessionUserID,
            new_username: usernameInput.value,
          },
        })
          .then((r) => {
            if (r.data.code === 40001) {
              // eslint-disable-next-line no-alert
              alert("Failed to update username");
            } else {
              // eslint-disable-next-line no-alert
              alert("Successfully updated username");
              setUsername(usernameInput.value);
            }
          })
          // eslint-disable-next-line no-console,no-shadow
          .catch((e) => console.error(e, username));
      }
    }

    isChangingUsername(!changeUsername);
  }

  function switchPassword(e) {
    e.preventDefault();
    const passwordInput = document.getElementById("password_input");

    if (changePassword) {
      // if we clicked the button and the text box is there, then we submit
      if (passwordInput.value.length > 0) {
        axios({
          method: "post",
          url: `http://localhost:4350/api/user/password`,
          headers: {
            Authorization: sessionJWT,
            withCredentials: true,
          },
          data: {
            user_id: sessionUserID,
            new_password: passwordInput.value,
          },
        })
          .then((r) => {
            if (r.data.code === 40000) {
              // eslint-disable-next-line no-alert
              alert("Failed to update password");
            } else {
              // eslint-disable-next-line no-alert
              alert("Successfully updated password");
              setPassword(passwordInput.value);
            }
          })
          // eslint-disable-next-line no-console,no-shadow
          .catch((e) => {
            // eslint-disable-next-line no-console
            console.error(e, password);
          });
      }
    }

    isChangingPassword(!changePassword);
  }

  function switchBio(e) {
    e.preventDefault();
    const bioInput = document.getElementById("bio_input");

    if (changeBio) {
      // if we clicked the button and the text box is there, then we submit
      if (bioInput.value.length > 0) {
        axios({
          method: "post",
          url: `http://localhost:4350/api/user/profile`,
          headers: {
            Authorization: sessionJWT,
            withCredentials: true,
          },
          data: {
            user_id: sessionUserID,
            profile_photo: "",
            is_writer: true,
            affiliation,
            bio: bioInput.value,
          },
        })
          .then((r) => {
            if (r.data.code === 40001) {
              // eslint-disable-next-line no-alert
              alert("Failed to update bio");
            } else {
              // eslint-disable-next-line no-alert
              alert("Successfully updated bio");
              setBio(bioInput.value);
            }
          })
          // eslint-disable-next-line no-console,no-shadow
          .catch((e) => console.error(e, bio));
      }
    }
    isChangingBio(!changeBio);
  }

  function switchAffiliation(e) {
    e.preventDefault();
    const affiliationInput = document.getElementById("affiliation_input");

    if (changeAffiliation) {
      // if we clicked the button and the text box is there, then we submit
      if (affiliationInput.value.length > 0) {
        axios({
          method: "post",
          url: `http://localhost:4350/api/user/profile`,
          headers: {
            Authorization: sessionJWT,
            withCredentials: true,
          },
          data: {
            user_id: sessionUserID,
            profile_photo: "",
            is_writer: true,
            affiliation: affiliationInput.value,
            bio,
          },
        })
          .then((r) => {
            if (r.data.code === 40001) {
              // eslint-disable-next-line no-alert
              alert("Failed to update affiliation");
            } else {
              // eslint-disable-next-line no-alert
              alert("Successfully updated affiliation");
              setAffiliation(affiliationInput.value);
            }
          })
          // eslint-disable-next-line no-console,no-shadow
          .catch((e) => console.error(e, affiliation));
      }
    }
    isChangingAffiliation(!changeAffiliation);
  }

  function renderPreferences() {
    return (
      <div>
        <div className="grid-rows-1 h-48">
          <div className="row-start-1 col-start-2 col-span-4 row-end-5 h-screen">
            <h1 className="mt-8 text-2xl font-bold ml-12 text-center text-simple font-base tracking-tight text-black-800 sm:text-5xl">
              {`${username || sessionStorage.getItem("user")}'s`} Preferences
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
              {username}
              {"'s "}
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
              {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
              <img
                className="rounded-full m-auto w-1/6"
                src="/sample_profile.jpg"
                alt="A sample profile picture"
              />
              <form className="grid grid-cols-3 gap-4">
                <h1 className="col-start-1 col-end-4 mt-4 text-2xl text-center font-bold border-b pb-4 tracking-tight text-simple sm:text-5xl">
                  Account Details
                </h1>
                <div className="text-right">Username</div>
                {!changeUsername ? (
                  <div>{username}</div>
                ) : (
                  <input
                    type="text"
                    placeholder={username}
                    id="username_input"
                  />
                )}
                <div>
                  <button
                    type="button"
                    className="hover:border-b-2 hover:border-black"
                    onClick={switchUsername}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                      />
                    </svg>
                  </button>
                </div>
                <div className="text-right">Password</div>
                {!changePassword ? (
                  <div>*******</div>
                ) : (
                  <input type="password" id="password_input" />
                )}
                <div>
                  <button
                    type="button"
                    className="hover:border-b-2 hover:border-black"
                    onClick={switchPassword}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                      />
                    </svg>
                  </button>
                </div>
              </form>
              <h1 className="mt-4 text-2xl pt-20 text-center font-bold border-b pb-4 tracking-tight text-simple sm:text-5xl">
                Bio
                <button
                  type="button"
                  className="hover:border-b-2 hover:border-black ml-4"
                  onClick={switchBio}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                    />
                  </svg>
                </button>
              </h1>
              <div className="flex justify-center">
                {!changeBio ? (
                  <p className="w-[40rem] text-center pt-4">{bio}</p>
                ) : (
                  <textarea
                    className="mt-4"
                    id="bio_input"
                    rows="4"
                    cols="50"
                    placeholder={bio}
                  />
                )}
              </div>
              <h1 className="mt-4 text-2xl pt-20 text-center font-bold border-b pb-4 tracking-tight text-simple sm:text-5xl">
                Affiliation
                <button
                  type="button"
                  className="hover:border-b-2 hover:border-black ml-4"
                  onClick={switchAffiliation}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                    />
                  </svg>
                </button>
              </h1>
              <div className="flex justify-center">
                {!changeAffiliation ? (
                  <p className="w-[40rem] text-center pt-4">{affiliation}</p>
                ) : (
                  <input
                    type="text"
                    placeholder={affiliation}
                    id="affiliation_input"
                  />
                )}
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
    <div>{page === "profile" ? renderProfile() : renderPreferences()}</div>
  );
}

export default Writer;
