import React, { useEffect, useState } from "react";
import axios from "axios";
// eslint-disable-next-line import/no-extraneous-dependencies
import formatDistanceToNow from "date-fns/formatDistanceToNow";
// eslint-disable-next-line import/no-extraneous-dependencies
import QRCode from "qrcode";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { showMessage, success, failure } from "../../util/messages";

function Comment({ id }) {
  const [hasLiked, changeHasLiked] = useState(false);
  const [writingComment, isWritingComment] = useState(false);
  const [hasWrittenComment, changeHasWrittenComment] = useState(false);
  const [oldestFirst, changeSortOrder] = useState(true);

  const [numLikes, updateLikes] = useState(null);
  const [comments, updateComments] = useState(null);

  const [qrCode, updateQRCode] = useState(null);

  const { userId, token } = JSON.parse(sessionStorage.getItem("session"));

  const navigate = useNavigate();

  useEffect(() => {
    // want to know if the user liked the post to display the like button appropriately
    axios({
      method: "get",
      params: {
        user_id: userId,
        post_id: id,
      },
      url: `http://localhost:4350/api/like/userLikedPost`,
      headers: {
        Authorization: token,
        withCredentials: true,
      },
    }).then((s) => {
      changeHasLiked(s.data.data);
    });

    // get the number of likes a post has to display
    axios({
      method: "get",
      params: {
        post_id: id,
      },
      url: `http://localhost:4350/api/like/getNumLikes`,
      headers: {
        Authorization: token,
        withCredentials: true,
      },
    }).then((s) => {
      updateLikes(s.data.data);
    });

    // get the comments of the post
    axios({
      method: "get",
      params: {
        post_id: id,
      },
      url: `http://localhost:4350/api/comment/getCommentsFromPost`,
      headers: {
        Authorization: token,
        withCredentials: true,
      },
    }).then((s) => {
      if (oldestFirst) {
        updateComments(s.data.data);
      } else {
        updateComments(s.data.data.reverse());
      }
    });
  }, [hasWrittenComment]);

  useEffect(() => {
    // generate QR code
    if (qrCode === null) {
      // change this later since we are sharing posts and not profiles
      QRCode.toString(
        `http://localhost:3000/post/${id}`,
        { type: "svg" },
        (err, svg) => {
          if (err) throw err;

          // a simple sanitizer for the svg
          // can probably add more checks
          if (
            !svg.includes("script") &&
            svg.includes("<svg") &&
            svg.split("<").length - 1 === 4 &&
            svg.split(">").length - 1 === 4
          ) {
            updateQRCode(svg);
          }
        }
      );
    }
  }, []);

  function changeOrdering() {
    const temp = [...comments];
    temp.reverse();
    updateComments(temp);
    changeSortOrder(!oldestFirst);
  }

  function likePost() {
    if (!hasLiked) {
      axios({
        method: "post",
        url: `http://localhost:4350/api/like/likePost`,
        headers: {
          Authorization: token,
          withCredentials: true,
        },
        data: {
          post_id: id,
          user_id: userId,
        },
      }).then(() => {
        updateLikes(numLikes + 1);
        changeHasLiked(!hasLiked);
      });
    } else {
      axios({
        method: "post",
        url: `http://localhost:4350/api/like/unlikePost`,
        headers: {
          Authorization: token,
          withCredentials: true,
        },
        data: {
          post_id: id,
          user_id: userId,
        },
      }).then(() => {
        updateLikes(numLikes - 1);
        changeHasLiked(!hasLiked);
      });
    }
  }

  function writeComment() {
    isWritingComment(!writingComment);
    changeHasWrittenComment(false);
  }

  function submitComment() {
    const commentInput = document.getElementById("comment_input");

    if (writingComment) {
      if (commentInput.value.trim().length > 0) {
        const newComment = {
          user_id: userId,
          post_id: id,
          content: commentInput.value.trim(),
        };

        axios({
          method: "post",
          url: `http://localhost:4350/api/comment/create`,
          headers: {
            Authorization: token,
            withCredentials: true,
          },
          data: newComment,
        }).then((r) => {
          // if there was a problem with the update
          if (r.data.code === 40000) {
            showMessage(
              document.getElementById("comment_message"),
              "Could not create comment!",
              failure,
              false
            );
          }
          // if the update was successful
          else {
            changeHasWrittenComment(true);
            showMessage(
              document.getElementById("comment_message"),
              "Comment created!",
              success,
              false
            );
          }
        });
      }
    }

    isWritingComment(!writingComment);
  }

  function showQRCodeModal() {
    document.getElementById("qr_code_modal").style.display = "block";
  }

  function hideQRCodeModal() {
    document.getElementById("qr_code_modal").style.display = "none";
  }

  const profileClick = (profile) => {
    navigate(`/writer/${profile}`);
  };

  const buttonClicked = "w-6 h-6 fill-purple-900 hover:fill-purple-600";
  const buttonNotClicked = "w-6 h-6 hover:fill-black fill-none";

  return (
    <div className="pt-16">
      <div
        className="relative z-10 hidden"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
        id="qr_code_modal"
      >
        <div className="fixed inset-0 transition-opacity" />
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="pt-5 pb-4">
                <div className="flex justify-center">
                  <div className="mt-3 flex justify-center">
                    <h2
                      className="text-3xl font-bold text-gray-900"
                      id="modal-title"
                    >
                      Share this post!
                    </h2>
                  </div>
                </div>
              </div>
              {/* eslint-disable */}
              <div className="flex justify-center">
                {qrCode !== null ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: qrCode }}
                    className="w-1/2 h-1/2"
                  />
                ) : (
                  "Cannot generate QR code!"
                )}
              </div>
              {/* eslint-enable */}
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={hideQRCodeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        <div className="basis-1/3 flex border-r-2 border-black justify-center">
          <div className="flex flex-col items-center md:flex-row">
            <button type="button" onClick={likePost}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                strokeWidth={!hasLiked ? "1.5" : "0"}
                stroke="currentColor"
                className={hasLiked ? buttonClicked : buttonNotClicked}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
                />
              </svg>
            </button>
            <p className="ml-2">
              {numLikes === null
                ? "Loading..."
                : `${numLikes} ${numLikes !== 1 ? "Likes" : "Like"}`}
            </p>
          </div>
        </div>
        <div className="basis-1/3 flex border-r-2 border-black justify-center">
          <div className="flex flex-col items-center md:flex-row">
            <button type="button" onClick={writeComment}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                strokeWidth={!writingComment ? "1.5" : "0"}
                stroke="currentColor"
                className={writingComment ? buttonClicked : buttonNotClicked}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                />
              </svg>
            </button>
            <p className="mx-2">Comment</p>
          </div>
        </div>
        <div className="basis-1/3 flex justify-center">
          <div className="flex flex-col items-center md:flex-row">
            <button type="button" onClick={showQRCodeModal}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className={buttonNotClicked}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                />
              </svg>
            </button>
            <p className="ml-2">Share</p>
          </div>
        </div>
      </div>
      {writingComment && (
        <div className="mt-4">
          <p>What&apos;s on your mind?</p>
          <textarea
            className="resize-none w-full h-32 rounded-lg"
            id="comment_input"
          />
          <div className="flex justify-end">
            <button
              type="button"
              className="rounded-md hover:bg-indigo-700 bg-neutral text-white p-2 h-fit"
              onClick={submitComment}
            >
              Submit
            </button>
          </div>
        </div>
      )}
      <div className="flex justify-center mt-4">
        <p id="comment_message" className="row-span-1 opacity-0 text-md" />
      </div>
      {comments && comments.length > 0 && (
        <div className="flex justify-end mt-4">
          <select onChange={changeOrdering} className="text-xs p-2 pr-8">
            <option value="oldest">Oldest first</option>
            <option value="newest">Newest first</option>
          </select>
        </div>
      )}
      {comments === null && <div>Loading...</div>}
      {comments !== null && (
        <div>
          {comments &&
            comments.map((comment) => (
              <div
                key={comment.comment_date}
                className="grid grid-cols-6 gap-2 border-black rounded-2xl border-2 p-4 mt-4 bg-white"
              >
                <div className="col-start-1 col-end-1 hidden md:col-end-2 md:flex justify-center">
                  <button
                    type="button"
                    className="h-[calc(8rem*0.5)] w-[calc(8rem*0.5)]"
                    onClick={() => profileClick(comment.user_id)}
                  >
                    <img
                      className="rounded-full object-cover w-full h-full"
                      src={
                        comment.profile_photo === null
                          ? "/sample_profile.jpg"
                          : comment.profile_photo
                      }
                      alt="Profile"
                    />
                  </button>
                </div>
                <div className="col-start-1 col-end-7 md:col-start-2">
                  <div className="mb-2 flex flex-col md:flex-row justify-between">
                    <p className="overflow-x-auto font-bold leading-4 text-[1rem] pb-2 mr-2">
                      {comment.username}
                    </p>
                    <p className="leading-4 text-[1rem] mt-2 md:mt-0 pb-2">
                      {formatDistanceToNow(new Date(comment.comment_date), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  <p className="overflow-x-auto py-2">{comment.content}</p>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default Comment;

Comment.propTypes = {
  // can keep this since it is up to preference according to the doc
  // eslint-disable-next-line
  id: PropTypes.any,
};
