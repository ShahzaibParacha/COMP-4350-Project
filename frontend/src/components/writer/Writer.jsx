import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import useAuthContext from "../../hooks/useAuthContext";
import {
  hideMessage,
  showMessage,
  success,
  failure,
} from "../../util/messages";
import { fromContextToSession, fromSessionToContext } from "../../util/state";
import Subscribed from "../subscribed/Subscribed";

function Writer() {
  const navigate = useNavigate();

  const loading = "Loading...";

  const [changeUsername, isChangingUsername] = useState(false);
  const [changePassword, isChangingPassword] = useState(false);
  const [changeBio, isChangingBio] = useState(false);
  const [changeAffiliation, isChangingAffiliation] = useState(false);
  const [changeImage, isChangingImage] = useState(false);
  const [changeDetails, isChangingDetails] = useState(false);

  const [username, setUsername] = useState(loading);
  const [password, setPassword] = useState(loading);
  const [bio, setBio] = useState(loading);
  const [affiliation, setAffiliation] = useState(loading);
  const [image, setImage] = useState("");

  const [hasSubscribed, changeHasSubscribed] = useState(false);
  const [hasEnabledNotif, changeHasEnabledNotif] = useState(false);

  const { userId: contextId, token: contextToken, dispatch } = useAuthContext();
  const { id } = useParams(); // userId is the id of the user who logged in; id is the id of the user whose profile is being rendered
  const { userId, token } = JSON.parse(sessionStorage.getItem("session"));

  useEffect(() => {
    fromSessionToContext(userId, token, dispatch);

    axios
      .get(`http://localhost:4350/api/user/profile`, {
        params: {
          user_id: id,
        },
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

        if (r.data.data.profile_photo.trim().length !== 0) {
          setImage(r.data.data.profile_photo);
        }
      })
      // eslint-disable-next-line no-console
      .catch((e) => console.error(e, username));

    axios({
      method: "get",
      params: {
        user_id: userId,
        creator_id: id,
      },
      url: `http://localhost:4350/api/user/subscription/isSubscribed`,
      headers: {
        Authorization: token,
        withCredentials: true,
      },
    }).then((s) => {
      changeHasSubscribed(s.data.data);
    });

    axios({
      method: "get",
      params: {
        user_id: userId,
        creator_id: id,
      },
      url: `http://localhost:4350/api/user/subscription/getSubscription`,
      headers: {
        Authorization: token,
        withCredentials: true,
      },
    }).then((s) => {
      if (s.data.data !== null) {
        changeHasEnabledNotif(s.data.data.receive_notification);
      }
    });
  }, [id]);

  useEffect(() => {
    fromContextToSession(contextId, contextToken);
  }, [contextId]);

  function showDeleteModal() {
    document.getElementById("delete_modal").style.zIndex = "10";
    document.getElementById("delete_modal").style.opacity = "1";
  }

  function hideDeleteModal() {
    document.getElementById("delete_modal").style.zIndex = "-10";
    document.getElementById("delete_modal").style.opacity = "0";
  }

  function deleteAccount() {
    axios
      .get(`http://localhost:4350/api/user/deleteAccount`, {
        params: {
          user_id: userId,
        },
        headers: {
          Authorization: token,
          withCredentials: true,
        },
      })
      .then((r) => {
        if (r.data.msg === "success") {
          dispatch({ type: "CLEAR", payload: "" });
          navigate("../login", { state: null });
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
    isChangingImage(false);

    const usernameMsg = document.getElementById("username_message");
    const passwordMsg = document.getElementById("password_message");
    const bioMsg = document.getElementById("bio_message");
    const affiliationMsg = document.getElementById("affiliation_message");
    const imgMsg = document.getElementById("image_message");

    if (usernameMsg !== null) {
      hideMessage(usernameMsg);
    }
    if (passwordMsg !== null) {
      hideMessage(passwordMsg);
    }
    if (bioMsg !== null) {
      hideMessage(bioMsg);
    }
    if (affiliationMsg !== null) {
      hideMessage(affiliationMsg);
    }
    if (imgMsg !== null) {
      hideMessage(imgMsg);
    }

    const accountDetails = document.getElementById("account_details");
    if (!changeDetails) {
      accountDetails.style.borderColor = "rgb(156 163 175)";
      accountDetails.style.maxHeight = "5000px";
    } else {
      accountDetails.style.borderColor = "transparent";
      accountDetails.style.maxHeight = "0px";
    }
  }

  function switchUsername(e) {
    e.preventDefault();
    const usernameInput = document.getElementById("username_input");

    if (changeUsername) {
      // do not update username if the username entered is the same
      // or if the textbox is left blank
      if (
        usernameInput.value.trim().length === 0 ||
        usernameInput.value.trim() === username
      ) {
        isChangingUsername(!changeUsername);
        hideMessage(document.getElementById("username_message"));
      } else if (usernameInput.value.trim().length > 25) {
        showMessage(
          document.getElementById("username_message"),
          "Username must be at most 25 characters!",
          failure,
          true
        );
      }
      // update username if the textbox is not left blank
      // and if the username entered is different from the current
      // username
      else if (
        usernameInput.value.trim().length > 0 &&
        username !== usernameInput.value.trim()
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
            new_username: usernameInput.value.trim(),
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
              setUsername(usernameInput.value.trim());
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
        oldPasswordInput.value.trim().length === 0 &&
        newPasswordInput.value.trim().length === 0 &&
        confirmNewPasswordInput.value.trim().length === 0
      ) {
        isChangingPassword(!changePassword);
        hideMessage(document.getElementById("password_message"));
      }
      // do not update password if the old password is not correct
      else if (oldPasswordInput.value.trim() !== password) {
        showMessage(
          document.getElementById("password_message"),
          "Incorrect old password!",
          failure,
          true
        );
      }
      // do not update password if the passwords do not match
      else if (
        newPasswordInput.value.trim() !== confirmNewPasswordInput.value.trim()
      ) {
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
            new_password: newPasswordInput.value.trim(),
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
              setPassword(newPasswordInput.value.trim());
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
          profile_photo: image,
          is_writer: true,
          affiliation,
          bio: bioInput.value.trim(),
        },
      })
        .then((r) => {
          // if there was a problem with the update
          if (r.data.code === 40001) {
            showMessage(
              document.getElementById("bio_message"),
              "Failed to update!",
              failure,
              false
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
            setBio(bioInput.value.trim());
          }
        })
        // eslint-disable-next-line no-console,no-shadow
        .catch((e) => console.error(e, bio));
    }
    isChangingBio(!changeBio);
  }

  function switchImage(e) {
    e.preventDefault();
    const imageInput = document.getElementById("image_input");

    if (changeImage) {
      const imageFormData = new FormData();

      if (imageInput && imageInput.files[0]) {
        imageFormData.append("image", imageInput.files[0]);

        // upload the image to the cloud
        axios({
          method: "post",
          url: `http://localhost:4350/api/aws/uploadImage`,
          headers: {
            Authorization: token,
            withCredentials: true,
            "Content-Type": "multipart/form-data",
          },
          data: imageFormData,
        }).then((result) => {
          // if the upload was successful, update the database
          axios({
            method: "post",
            url: `http://localhost:4350/api/user/profile`,
            headers: {
              Authorization: token,
              withCredentials: true,
            },
            data: {
              user_id: userId,
              profile_photo: result.data.data.imageUrl,
              is_writer: true,
              affiliation,
              bio,
            },
          }).then(() => {
            // delete the image to not crowd our bucket
            axios({
              method: "post",
              url: `http://localhost:4350/api/aws/deleteImage`,
              headers: {
                Authorization: token,
                withCredentials: true,
              },
              data: { image },
            });

            showMessage(
              document.getElementById("image_message"),
              "Successfully updated!",
              "#00DD00",
              false,
              "center"
            );
            setImage(result.data.data.imageUrl);
          });
        });
      }
    }

    isChangingImage(!changeImage);
  }

  function switchAffiliation(e) {
    e.preventDefault();
    const affiliationInput = document.getElementById("affiliation_input");

    if (
      affiliationInput !== null &&
      affiliationInput.value.trim().length > 40
    ) {
      showMessage(
        document.getElementById("affiliation_message"),
        "Affiliation must be at most 40 characters!",
        failure,
        true
      );
    } else {
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
            profile_photo: image,
            is_writer: true,
            affiliation: affiliationInput.value.trim(),
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
                false
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
              setAffiliation(affiliationInput.value.trim());
            }
          })
          // eslint-disable-next-line no-console,no-shadow
          .catch((e) => console.error(e, affiliation));
      }

      isChangingAffiliation(!changeAffiliation);
    }
  }

  function enableNotif() {
    console.log(userId, id);
    axios({
      method: "post",
      data: {
        user_id: userId,
        creator_id: id,
        set_notification: !hasEnabledNotif,
      },
      url: `http://localhost:4350/api/user/subscription/setNotification`,
      headers: {
        Authorization: token,
        withCredentials: true,
      },
    }).then((s) => {
      if (s.data.code !== 40011) {
        changeHasEnabledNotif(!hasEnabledNotif);
      }
    });
  }

  function subscribe() {
    if (!hasSubscribed) {
      axios({
        method: "post",
        url: `http://localhost:4350/api/user/subscription/followNewUser`,
        headers: {
          Authorization: token,
          withCredentials: true,
        },
        data: {
          user_id: userId,
          creator_id: id,
        },
      }).then((s) => {
        if (s.data.code !== 40011) {
          changeHasSubscribed(!hasSubscribed);
          changeHasEnabledNotif(true);
        }
      });
    } else {
      axios({
        method: "get",
        params: {
          user_id: userId,
          creator_id: id,
        },
        url: `http://localhost:4350/api/user/subscription/cancel`,
        headers: {
          Authorization: token,
          withCredentials: true,
        },
      }).then((s) => {
        if (s.data.code !== 40011) {
          changeHasSubscribed(!hasSubscribed);
          changeHasEnabledNotif(false);
        }
      });
    }
  }

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
    const classForEditBio = "flex flex-col items-start w-full pb-4";
    const classForBio = "flex flex-col items-start w-full";

    return (
      <div className="w-screen bg-base-100">
        <div
          className="relative z-[-10] transition-opacity"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
          id="delete_modal"
        >
          <div className="fixed inset-0" />
          <div className="fixed inset-0 overflow-y-auto">
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

        <div className="w-9/12 h-fit min-h-screen mx-auto px-8">
          <div className="m-auto mb-4 pt-8 pb-4 w-full flex gap-8 items-start">
            <div className="flex flex-col items-center w-6/12">
              <div
                id="image_card"
                className="flex flex-col items-center w-full p-4 rounded-3xl bg-neutral shadow-2xl mb-4 transition-transform hover-card"
              >
                <img
                  className="rounded-full w-[calc(100vw*0.25)] h-[calc(100vw*0.25)] lg:w-[calc(100vw*0.15)] lg:h-[calc(100vw*0.15)] object-cover text-center leading-[calc(100vw*0.25)] lg:leading-[calc(100vw*0.15)] bg-white mb-4"
                  src={image === "" ? "/sample_profile.jpg" : image}
                  alt="Profile"
                />
                {changeDetails && !changeImage && (
                  <button type="button" onClick={switchImage}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6 fill-none hover:fill-white enlarge-md stroke-white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                      />
                    </svg>
                  </button>
                )}
                {changeDetails && changeImage && (
                  <div className="flex flex-col items-center md:flex-row">
                    <input
                      type="file"
                      accept="image/*"
                      id="image_input"
                      className="w-full text-white mr-2"
                    />
                    <button type="button" onClick={switchImage}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6 hover:stroke-green-500 stroke-white enlarge-md"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                    </button>
                  </div>
                )}
                <p id="image_message" className="opacity-0 text-xs" />
                <div className="flex justify-center items-center w-full">
                  <h1 className="text-3xl font-bold text-white overflow-x-auto py-2">
                    {username}
                  </h1>
                </div>
              </div>
              <Subscribed id={id} />
            </div>
            <div
              id="details_card"
              className="flex flex-col w-6/12 p-2 gap-1 border-2 border-black p-4 rounded-3xl shadow-2xl hover-card transition-transform"
            >
              <div className="flex justify-end">
                {id === userId && (
                  <button
                    type="button"
                    className="rounded-md hover:bg-indigo-700 bg-neutral text-white p-2 w-fit mb-4"
                    onClick={switchMode}
                  >
                    {!changeDetails ? "Edit Profile" : "Finish Editing"}
                  </button>
                )}
                <div className="flex justify-end mb-4">
                  {id !== userId && (
                    <button
                      type="button"
                      className={
                        hasSubscribed
                          ? "hover:bg-indigo-700 bg-neutral text-white p-2 h-[40px] rounded-l-md"
                          : "hover:bg-indigo-700 bg-neutral text-white p-2 h-[40px] rounded-md"
                      }
                      onClick={subscribe}
                    >
                      {!hasSubscribed ? "Subscribe" : "Subscribed"}
                    </button>
                  )}
                  {hasSubscribed && id !== userId && (
                    <button
                      type="button"
                      onClick={enableNotif}
                      className="hover:bg-indigo-700 bg-neutral text-white h-[40px] p-2 rounded-r-md"
                    >
                      {hasEnabledNotif ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.0"
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.0"
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9.143 17.082a24.248 24.248 0 003.844.148m-3.844-.148a23.856 23.856 0 01-5.455-1.31 8.964 8.964 0 002.3-5.542m3.155 6.852a3 3 0 005.667 1.97m1.965-2.277L21 21m-4.225-4.225a23.81 23.81 0 003.536-1.003A8.967 8.967 0 0118 9.75V9A6 6 0 006.53 6.53m10.245 10.245L6.53 6.53M3 3l3.53 3.53"
                          />
                        </svg>
                      )}
                    </button>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-start w-full">
                <div className="flex">
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
                          className="w-6 h-6 fill-none hover:fill-black enlarge-md"
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
                          className="w-6 h-6 hover:stroke-green-500 enlarge-md"
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
                <div className="w-full">
                  {!changeAffiliation ? (
                    <p className="overflow-x-auto py-2">{affiliation}</p>
                  ) : (
                    <textarea
                      className="rounded-md text-md p-1 w-full resize-none h-[36px] p-1"
                      id="affiliation_input"
                      defaultValue={affiliation}
                    />
                  )}
                </div>
                <p
                  id="affiliation_message"
                  className="row-span-1 opacity-0 text-xs w-full"
                />
              </div>
              <div className={changeDetails ? classForEditBio : classForBio}>
                <div className="flex w-full">
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
                          className="w-6 h-6 fill-none hover:fill-black enlarge-md"
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
                          className="w-6 h-6 hover:stroke-green-500 enlarge-md"
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
                {!changeBio ? (
                  <p className="w-full overflow-auto py-2">{bio}</p>
                ) : (
                  <textarea
                    className="w-full h-[169px] rounded-md resize-none p-1"
                    id="bio_input"
                    defaultValue={bio}
                  />
                )}
                <p id="bio_message" className="opacity-0 text-xs" />
              </div>
              {true && (
                <div
                  className="w-full border-transparent border-t-2 transition-[max-height, border-color] duration-[690ms] overflow-y-clip max-h-0"
                  id="account_details"
                >
                  <form>
                    <h2 className="text-start text-2xl font-bold tracking-tight text-gray-900 my-2">
                      Account Details
                    </h2>
                    <div className="flex flex-col justify-start gap-1">
                      <div className="flex">
                        <h3 className="font-bold text-lg mr-1">Username</h3>
                        {changeDetails && (
                          <button type="button" onClick={switchUsername}>
                            {!changeUsername ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-6 h-6 fill-none hover:fill-black enlarge-md"
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
                                className="w-6 h-6 hover:stroke-green-500 enlarge-md"
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
                      {!changeUsername ? (
                        <p className="overflow-auto w-full py-2">{username}</p>
                      ) : (
                        <input
                          type="text"
                          id="username_input"
                          className="w-full rounded-md text-sm p-1"
                          placeholder={username}
                        />
                      )}
                      <p id="username_message" className="opacity-0 text-xs" />
                      <div className="flex">
                        <p className="font-bold text-lg mr-1">
                          {!changePassword ? "Password" : "Old Password"}
                        </p>
                        {changeDetails && (
                          <button type="button" onClick={switchPassword}>
                            {!changePassword ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-6 h-6 fill-none hover:fill-black enlarge-md"
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
                                className="w-6 h-6 hover:stroke-green-500 enlarge-md"
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
                      <div className="flex justify-between">
                        {!changePassword ? (
                          <p className="w-full overflow-auto py-2">
                            {getStarString(password)}
                          </p>
                        ) : (
                          <input
                            type="password"
                            id="old_password_input"
                            className="rounded-md text-sm p-1 w-full"
                          />
                        )}
                      </div>
                      {changePassword && (
                        <div>
                          <h3 className="font-bold text-lg mr-1">
                            New Password
                          </h3>
                          <input
                            type="password"
                            id="new_password_input"
                            className="rounded-md text-sm p-1 w-full"
                          />
                        </div>
                      )}
                      {changePassword && (
                        <div>
                          <h3 className="font-bold text-lg mr-1">
                            Confirm New Password
                          </h3>
                          <input
                            type="password"
                            id="confirm_new_password_input"
                            className="rounded-md text-sm p-1 w-full"
                          />
                        </div>
                      )}
                      <p id="password_message" className="opacity-0 text-xs" />
                      <div className="flex justify-end">
                        <button
                          type="button"
                          className="rounded-md hover:bg-red-900 bg-red-500 text-white p-2 mt-16"
                          onClick={showDeleteModal}
                        >
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return renderProfile();
}

export default Writer;
