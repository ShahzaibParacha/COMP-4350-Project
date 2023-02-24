import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import useAuthContext from "../../hooks/useAuthContext";
import Comment from "../comment/comment";

function Writer() {
  // const [page, setPage] = useState("profile");
  const navigate = useNavigate();

  const [changeUsername, isChangingUsername] = useState(false);
  const [changePassword, isChangingPassword] = useState(false);
  const [changeBio, isChangingBio] = useState(false);
  const [changeAffiliation, isChangingAffiliation] = useState(false);
  const [changeDetails, isChangingDetails] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [affiliation, setAffiliation] = useState("");

  const { userId, token, dispatch } = useAuthContext();
  const { id } = useParams(); // userId is the id of the user who logged in; id is the id of the user whose profile is being rendered

  const success = "#006600";
  const failure = "#660000";

  const post = {
    content: "Start writing...",
    post_date: "2023-02-24T16:40:08.178Z",
    _id: "63f8f5d64172cc717673675f",
    user_id: "63ed9f2533c8c71a58f98b9b",
    __v: 0,
  };

  useEffect(() => {
    axios
      .get(`http://localhost:4350/api/user/profile`, {
        params: { user_id: userId },
        headers: {
          Authorization: token,
          withCredentials: true,
        },
      })
      .then((r) => {
        // stores the user profile
        setUsername(r.data.data.username);
        setPassword(r.data.data.password);
        setBio(r.data.data.bio);
        setAffiliation(r.data.data.affiliation);
      })
      // eslint-disable-next-line no-console
      .catch((e) => console.error(e, username));
  }, [username, password, bio, affiliation]);

  // function handlePageChange() {
  //   if (page === "profile") {
  //     setPage("preferences");
  //   } else if (page === "preferences") {
  //     setPage("profile");
  //   }
  // }

  /* eslint-disable */
  function animationEnd(e) {
    hideMessage(e.target);
  }

  // trigger the message animation
  function showMessage(element, message, color, persists) {
    element.innerHTML = message;
    element.style.color = color;
    element.style.opacity = "1";
    element.classList = "";

    if (!persists) {
      element.addEventListener("animationend", animationEnd);
      element.classList = "vanishing";
    }
  }

  function hideMessage(element) {
    element.innerHTML = "";
    element.style.opacity = "0";
    element.classList = "";
  }
  /* eslint-enable */

  function showDeleteModal() {
    document.getElementById("delete_modal").style.display = "block";
  }

  function hideDeleteModal() {
    document.getElementById("delete_modal").style.display = "none";
  }

  function deleteAccount() {
    axios
      .get(`http://localhost:4350/api/user/delete_account`, {
        params: { user_id: userId },
        headers: {
          Authorization: token,
          withCredentials: true,
        },
      })
      .then((r) => {
        if (r.data.msg === "success") {
          dispatch({ type: "CLEAR", payload: "" });
          navigate("../login");
        }
      })
      // eslint-disable-next-line no-console
      .catch((e) => console.error(e, username));
  }

  function switchMode(e) {
    e.preventDefault();
    isChangingDetails(!changeDetails);
    isChangingBio(false);
    isChangingPassword(false);
    isChangingUsername(false);
    isChangingAffiliation(false);
    isChangingBio(false);
  }

  function switchUsername(e) {
    e.preventDefault();
    const usernameInput = document.getElementById("username_input");

    if (changeUsername) {
      // do not update username if the username entered is the same
      // or if the textbox is left blank
      if (
        usernameInput.value.length === 0 ||
        usernameInput.value === username
      ) {
        isChangingUsername(!changeUsername);
        hideMessage(document.getElementById("username_message"));
      }
      // update username if the textbox is not left blank
      // and if the username entered is different from the current
      // username
      else if (
        usernameInput.value.length > 0 &&
        username !== usernameInput.value
      ) {
        axios({
          method: "post",
          url: `http://localhost:4350/api/user/username`,
          headers: {
            Authorization: token,
            withCredentials: true,
          },
          data: {
            user_id: userId,
            new_username: usernameInput.value,
          },
        })
          .then((r) => {
            // if there was a problem with the update
            if (r.data.code === 40001) {
              showMessage(
                document.getElementById("username_message"),
                "Username already exists!",
                failure,
                true
              );
            }
            // if the update was successful
            else {
              showMessage(
                document.getElementById("username_message"),
                "Successfully updated!",
                success,
                false
              );
              setUsername(usernameInput.value);
              isChangingUsername(!changeUsername);
            }
          })
          // eslint-disable-next-line no-console,no-shadow
          .catch((e) => console.error(e, username));
      }
    }

    if (!changeUsername) {
      isChangingUsername(!changeUsername);
    }
  }

  function switchPassword(e) {
    e.preventDefault();
    const oldPasswordInput = document.getElementById("old_password_input");
    const newPasswordInput = document.getElementById("new_password_input");
    const confirmNewPasswordInput = document.getElementById(
      "confirm_new_password_input"
    );

    if (changePassword) {
      // do not update password if all the textboxes are left blank
      if (
        oldPasswordInput.value.length === 0 &&
        newPasswordInput.value.length === 0 &&
        confirmNewPasswordInput.value.length === 0
      ) {
        isChangingPassword(!changePassword);
        hideMessage(document.getElementById("password_message"));
      }
      // do not update password if the old password is not correct
      else if (oldPasswordInput.value !== password) {
        showMessage(
          document.getElementById("password_message"),
          "Incorrect old password!",
          failure,
          true
        );
      }
      // do not update password if the passwords do not match
      else if (newPasswordInput.value !== confirmNewPasswordInput.value) {
        showMessage(
          document.getElementById("password_message"),
          "Passwords do not match!",
          failure,
          true
        );
      } else {
        axios({
          method: "post",
          url: `http://localhost:4350/api/user/password`,
          headers: {
            Authorization: token,
            withCredentials: true,
          },
          data: {
            user_id: userId,
            new_password: newPasswordInput.value,
          },
        })
          .then((r) => {
            // if there was a problem with the update
            if (r.data.code === 40000) {
              showMessage(
                document.getElementById("password_message"),
                "Password length must be 8-20 characters and contain a number and an upper and lowercase character!",
                failure,
                true
              );
            }
            // if the update was successful
            else {
              showMessage(
                document.getElementById("password_message"),
                "Successfully updated!",
                success,
                false
              );
              setPassword(newPasswordInput.value);
              isChangingPassword(!changePassword);
            }
          })
          .catch((err) => {
            // eslint-disable-next-line no-console
            console.error(err, password);
          });
      }
    }

    if (!changePassword) {
      isChangingPassword(!changePassword);
    }
  }

  function switchBio(e) {
    e.preventDefault();
    const bioInput = document.getElementById("bio_input");

    if (changeBio) {
      axios({
        method: "post",
        url: `http://localhost:4350/api/user/profile`,
        headers: {
          Authorization: token,
          withCredentials: true,
        },
        data: {
          user_id: userId,
          profile_photo: "",
          is_writer: true,
          affiliation,
          bio: bioInput.value,
        },
      })
        .then((r) => {
          // if there was a problem with the update
          if (r.data.code === 40001) {
            showMessage(
              document.getElementById("bio_message"),
              "Failed to update!",
              failure,
              true
            );
          }
          // if the update was successful
          else {
            showMessage(
              document.getElementById("bio_message"),
              "Successfully updated!",
              success,
              false
            );
            setBio(bioInput.value);
          }
        })
        // eslint-disable-next-line no-console,no-shadow
        .catch((e) => console.error(e, bio));
    }
    isChangingBio(!changeBio);
  }

  function switchAffiliation(e) {
    e.preventDefault();
    const affiliationInput = document.getElementById("affiliation_input");

    if (changeAffiliation) {
      axios({
        method: "post",
        url: `http://localhost:4350/api/user/profile`,
        headers: {
          Authorization: token,
          withCredentials: true,
        },
        data: {
          user_id: userId,
          profile_photo: "",
          is_writer: true,
          affiliation: affiliationInput.value,
          bio,
        },
      })
        .then((r) => {
          // if there was a problem with the update
          if (r.data.code === 40001) {
            showMessage(
              document.getElementById("affiliation_message"),
              "Failed to update!",
              failure,
              true
            );
          }
          // if the update was successful
          else {
            showMessage(
              document.getElementById("affiliation_message"),
              "Successfully updated!",
              success,
              false
            );
            setAffiliation(affiliationInput.value);
          }
        })
        // eslint-disable-next-line no-console,no-shadow
        .catch((e) => console.error(e, affiliation));
    }
    isChangingAffiliation(!changeAffiliation);
  }

  // function renderPreferences() {
  //   return (
  //     <div>
  //       <div className="grid-rows-1 h-48">
  //         <div className="row-start-1 col-start-2 col-span-4 row-end-5 h-screen">
  //           <h1 className="mt-8 text-2xl font-bold ml-12 text-center text-simple font-base tracking-tight text-black-800 sm:text-5xl">
  //             {`${username}'s`} Preferences
  //           </h1>
  //         </div>
  //       </div>
  //       <div className="grid grid-rows-4 grid-cols-6 gap-4">
  //         <div className="row-start-1 justify-items-center row-end-5 bg-black-600 row-span-2 h-screen">
  //           <button
  //             id="preferences"
  //             type="button"
  //             className=" bg-base-100 w-9/12 text-center text-simple border-neutral border-2 hover:bg-neutral hover:text-white px-5 py-3.5 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
  //             onClick={handlePageChange}
  //           >
  //             Return to Profile
  //           </button>
  //         </div>
  //         <div className="row-start-1 col-start-2 col-span-4 row-end-5 h-screen">
  //           <div className="grid-column-1">
  //             <h1 className="mt-4 pl-4 text-2xl text-left font-bold border-b pb-4 tracking-tight text-simple sm:text-5xl">
  //               Delete Account
  //             </h1>
  //             <div className="flex justify-left">
  //               <p className="w-6/12 pl-4 text-left pt-4">
  //                 If you would like to delete your account, click on the button
  //                 on the right. We store none of your data when you leave. Once
  //                 deleted, the only way back is to create a new account.
  //               </p>
  //               <div className="w-6/12 flex justify-center">
  //                 <button
  //                   className="rounded-md bg-neutral px-5 py-3.5 text-sm mt-6 font-semibold text-white shadow-sm hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
  //                   type="button"
  //                   onClick={handleDeletion}
  //                 >
  //                   Delete Account
  //                 </button>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //         <div className="row-start-1 row-end-5 h-screen" />
  //       </div>
  //     </div>
  //   );
  // }

  // return a string of *'s of the same length as the password
  function getStarString(s) {
    const { length } = s;
    let toReturn = "";
    for (let i = 0; i < length; i += 1) {
      toReturn += "*";
    }

    return toReturn;
  }

  function renderProfile() {
    return (
      <div className="w-screen">
        <div
          className="relative z-10 hidden"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
          id="delete_modal"
        >
          <div className="fixed inset-0 transition-opacity" />
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <svg
                        className="h-6 w-6 text-red-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                        />
                      </svg>
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="font-bond leading-6" id="modal-title">
                        Delete Account
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm">
                          Are you sure you want to delete your account?
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={deleteAccount}
                  >
                    Deactivate
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={hideDeleteModal}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-9/12 h-fit min-h-screen mx-auto bg-gray-200 px-8">
          <div className="m-auto grid grid-cols-2 grid-rows-6 mb-4 border-black border-b-2 pt-8 pb-4">
            <div className="flex justify-center items-center col-start-1 col-end-2 row-start-1 row-end-4 border-solid border-2">
              <img
                className="rounded-full w-[calc(20rem*0.83*0.75)] h-[calc(20rem*0.83*0.75)]"
                src="/sample_profile.jpg"
                alt="Profile"
              />
            </div>
            <div className="flex justify-center items-center col-start-1 col-end-2 row-start-4 row-end-5 border-sold border-2">
              <h1 className="text-center text-3xl font-bold tracking-tight text-gray-900">
                {username}
              </h1>
            </div>
            <div className="grid grid-rows-9 col-start-2 col-end-3 row-span-5 gap-2">
              <div className="flex justify-between row-span-1">
                <div className="flex items-center">
                  <h1 className="text-center text-2xl font-bold tracking-tight text-gray-900 mr-1">
                    Affiliation
                  </h1>
                  {changeDetails && (
                    <button type="button" onClick={switchAffiliation}>
                      {!changeAffiliation ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-6 h-6 fill-none hover:fill-black"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-6 h-6 hover:stroke-green-500"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                      )}
                    </button>
                  )}
                </div>
              </div>
              <div className="row-span-1 overflow-x-auto">
                {!changeAffiliation ? (
                  affiliation
                ) : (
                  <input
                    type="text"
                    id="affiliation_input"
                    className="rounded-md text-md p-1 w-full"
                    placeholder={affiliation}
                  />
                )}
              </div>
              <p
                id="affiliation_message"
                className="row-span-1 opacity-0 text-xs"
              />
              <div className="flex items-center row-span-1">
                <h1 className="text-center text-2xl font-bold tracking-tight text-gray-900 mr-1">
                  Bio
                </h1>
                {changeDetails && (
                  <button type="button" onClick={switchBio}>
                    {!changeBio ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6 fill-none hover:fill-black"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6 hover:stroke-green-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                    )}
                  </button>
                )}
              </div>
              <div className="row-span-4 h-60">
                {!changeBio ? (
                  <p className="overflow-y-auto w-full h-fit max-h-[83%]">
                    {bio}
                  </p>
                ) : (
                  <textarea
                    className="rounded-md h-5/6 w-full resize-none p-1"
                    id="bio_input"
                  >
                    {bio}
                  </textarea>
                )}
                <p id="bio_message" className="opacity-0 text-xs" />
              </div>
            </div>
            <div className="flex justify-between items-center col-start-1 col-end-3 row-start-6 row-end-7">
              {id === userId && (
                <button
                  type="button"
                  className="rounded-md hover:bg-indigo-700 bg-neutral text-white p-2 h-fit"
                  onClick={switchMode}
                >
                  {!changeDetails ? "Edit Profile" : "Finish Editing"}
                </button>
              )}
              {id !== userId && (
                <button
                  type="button"
                  className="rounded-md hover:bg-indigo-700 bg-neutral text-white p-2 h-fit"
                  onClick={switchUsername}
                >
                  Subscribe
                </button>
              )}
            </div>
          </div>
          {changeDetails && (
            <div className="w-full">
              <form>
                <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900 mb-4">
                  Account Details
                </h2>
                <div className="mb-8">
                  <div className="flex justify-center items-start gap-4 mb-2">
                    <div className="basis-1/5 flex justify-end">
                      <p className="font-bold">Username:</p>
                    </div>
                    <div className="basis-1/3 flex flex-col">
                      {!changeUsername ? (
                        <p className="basis-1/3">{username}</p>
                      ) : (
                        <input
                          type="text"
                          id="username_input"
                          className="rounded-md text-sm p-1"
                          placeholder={username}
                        />
                      )}
                      <p id="username_message" className="opacity-0 text-xs" />
                    </div>
                    <div className="basis-1/5">
                      {changeDetails && (
                        <button type="button" onClick={switchUsername}>
                          {!changeUsername ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-6 h-6 fill-none hover:fill-black"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                              />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-6 h-6 hover:stroke-green-500"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4.5 12.75l6 6 9-13.5"
                              />
                            </svg>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-center items-start gap-4">
                    <div className="basis-1/5 flex justify-end items-center">
                      <p className="font-bold text-right">
                        {!changePassword ? "Password:" : "Old Password"}
                      </p>
                    </div>
                    {!changePassword ? (
                      <p className="basis-1/3">{getStarString(password)}</p>
                    ) : (
                      <input
                        type="password"
                        id="old_password_input"
                        className="rounded-md text-sm p-1 basis-1/3"
                      />
                    )}
                    {changeDetails && (
                      <div className="basis-1/5">
                        <button type="button" onClick={switchPassword}>
                          {!changePassword ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-6 h-6 fill-none hover:fill-black"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                              />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-6 h-6 hover:stroke-green-500"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4.5 12.75l6 6 9-13.5"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                  {changePassword && (
                    <div className="flex justify-center items-start gap-4 my-2">
                      <div className="basis-1/5 flex justify-end items-center">
                        <p className="font-bold text-right">New Password</p>
                      </div>
                      <input
                        type="password"
                        id="new_password_input"
                        className="rounded-md text-sm p-1 basis-1/3"
                      />
                      <div className="basis-1/5" />
                    </div>
                  )}
                  {changePassword && (
                    <div className="flex justify-center items-start gap-4">
                      <div className="basis-1/5 flex justify-end items-center">
                        <p className="font-bold text-right">
                          Confirm New Password
                        </p>
                      </div>
                      <input
                        type="password"
                        id="confirm_new_password_input"
                        className="rounded-md text-sm p-1 basis-1/3"
                      />
                      <div className="basis-1/5" />
                    </div>
                  )}
                  <div className="flex justify-center gap-4">
                    <div className="basis-1/5" />
                    <div className="basis-1/3 flex justify-left">
                      <p id="password_message" className="opacity-0 text-xs" />
                    </div>
                    <div className="basis-1/5" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="rounded-md hover:bg-red-900 bg-red-500 text-white p-2"
                    onClick={showDeleteModal}
                  >
                    Delete Account
                  </button>
                </div>
              </form>
            </div>
          )}
          <Comment post={post} />
        </div>
      </div>
    );

    // return <div className="w-screen bg-gray">Hello World</div>;
    // return (
    //   <div>
    //     <div className="grid-rows-1 h-48">
    //       <div>
    //         <h1 className="mt-8 text-2xl font-bold ml-12 text-center text-simple font-base tracking-tight text-black-800 sm:text-5xl">
    //           {username}
    //           {"'s "}
    //           Profile
    //         </h1>
    //       </div>
    //     </div>
    //     <div className="grid grid-rows-4 grid-cols-6 gap-4">
    //       <div className="row-start-1 justify-items-center row-end-5 bg-black-600 row-span-2 h-screen">
    //         <Link
    //           to={`../writer/${userId}
    //         )}/write`}
    //           type="button"
    //           className=" bg-base-100 w-9/12 text-center text-simple border-neutral border-2 hover:bg-neutral hover:text-white px-5 py-3.5 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    //         >
    //           Create a post
    //         </Link>
    //         <button
    //           id="preferences"
    //           type="button"
    //           className=" bg-base-100 w-9/12 text-center border-t-0 text-simple border-neutral border-2 hover:bg-neutral hover:text-white px-5 py-3.5 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    //           onClick={handlePageChange}
    //         >
    //           Manage Preferences
    //         </button>
    //       </div>
    //       <div className="row-start-1 col-start-2 col-span-4 row-end-5 h-screen">
    //         <div className="grid-column-1">
    //           {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
    //           <img
    //             className="rounded-full m-auto w-1/6"
    //             src="/sample_profile.jpg"
    //             alt="A sample profile picture"
    //           />
    //           <form className="grid grid-cols-3 gap-4">
    //             <h1 className="col-start-1 col-end-4 mt-4 text-2xl text-center font-bold border-b pb-4 tracking-tight text-simple sm:text-5xl">
    //               Account Details
    //             </h1>
    //             <div className="text-right">Username</div>
    //             {!changeUsername ? (
    //               <div>{username}</div>
    //             ) : (
    //               <input
    //                 type="text"
    //                 placeholder={username}
    //                 id="username_input"
    //               />
    //             )}
    //             <div>
    //               <button
    //                 type="button"
    //                 className="hover:border-b-2 hover:border-black"
    //                 onClick={switchUsername}
    //               >
    //                 <svg
    //                   xmlns="http://www.w3.org/2000/svg"
    //                   fill="none"
    //                   viewBox="0 0 24 24"
    //                   strokeWidth="1.5"
    //                   stroke="currentColor"
    //                   className="w-6 h-6"
    //                 >
    //                   <path
    //                     strokeLinecap="round"
    //                     strokeLinejoin="round"
    //                     d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
    //                   />
    //                 </svg>
    //               </button>
    //             </div>
    //             <div className="text-right">Password</div>
    //             {!changePassword ? (
    //               <div>*******</div>
    //             ) : (
    //               <input type="password" id="password_input" />
    //             )}
    //             <div>
    //               <button
    //                 type="button"
    //                 className="hover:border-b-2 hover:border-black"
    //                 onClick={switchPassword}
    //               >
    //                 <svg
    //                   xmlns="http://www.w3.org/2000/svg"
    //                   fill="none"
    //                   viewBox="0 0 24 24"
    //                   strokeWidth="1.5"
    //                   stroke="currentColor"
    //                   className="w-6 h-6"
    //                 >
    //                   <path
    //                     strokeLinecap="round"
    //                     strokeLinejoin="round"
    //                     d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
    //                   />
    //                 </svg>
    //               </button>
    //             </div>
    //           </form>
    //           <h1 className="mt-4 text-2xl pt-20 text-center font-bold border-b pb-4 tracking-tight text-simple sm:text-5xl">
    //             Bio
    //             <button
    //               type="button"
    //               className="hover:border-b-2 hover:border-black ml-4"
    //               onClick={switchBio}
    //             >
    //               <svg
    //                 xmlns="http://www.w3.org/2000/svg"
    //                 fill="none"
    //                 viewBox="0 0 24 24"
    //                 strokeWidth="1.5"
    //                 stroke="currentColor"
    //                 className="w-6 h-6"
    //               >
    //                 <path
    //                   strokeLinecap="round"
    //                   strokeLinejoin="round"
    //                   d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
    //                 />
    //               </svg>
    //             </button>
    //           </h1>
    //           <div className="flex justify-center">
    //             {!changeBio ? (
    //               <p className="w-[40rem] text-center pt-4">{bio}</p>
    //             ) : (
    //               <textarea
    //                 className="mt-4"
    //                 id="bio_input"
    //                 rows="4"
    //                 cols="50"
    //                 placeholder={bio}
    //               />
    //             )}
    //           </div>
    //           <h1 className="mt-4 text-2xl pt-20 text-center font-bold border-b pb-4 tracking-tight text-simple sm:text-5xl">
    //             Affiliation
    //             <button
    //               type="button"
    //               className="hover:border-b-2 hover:border-black ml-4"
    //               onClick={switchAffiliation}
    //             >
    //               <svg
    //                 xmlns="http://www.w3.org/2000/svg"
    //                 fill="none"
    //                 viewBox="0 0 24 24"
    //                 strokeWidth="1.5"
    //                 stroke="currentColor"
    //                 className="w-6 h-6"
    //               >
    //                 <path
    //                   strokeLinecap="round"
    //                   strokeLinejoin="round"
    //                   d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
    //                 />
    //               </svg>
    //             </button>
    //           </h1>
    //           <div className="flex justify-center">
    //             {!changeAffiliation ? (
    //               <p className="w-[40rem] text-center pt-4">{affiliation}</p>
    //             ) : (
    //               <input
    //                 type="text"
    //                 placeholder={affiliation}
    //                 id="affiliation_input"
    //               />
    //             )}
    //           </div>
    //         </div>
    //         <h1 className="mt-4 text-2xl pt-20 text-center font-bold border-b pb-4 tracking-tight text-simple sm:text-5xl">
    //           Recommendations
    //         </h1>
    //         <div className="flex w-[40rem] pt-4 justify-center">
    //           <ul className="list-disc">
    //             <li>one</li>
    //             <li>two</li>
    //           </ul>
    //         </div>
    //       </div>
    //       <div className="row-start-1 row-end-5 h-screen" />
    //     </div>
    //   </div>
    // );
  }

  return renderProfile();
  // <div>{page === "profile" ? renderProfile() : renderPreferences()}</div>
}

export default Writer;
