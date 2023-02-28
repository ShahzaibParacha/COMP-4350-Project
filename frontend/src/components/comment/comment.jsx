import React, { useEffect, useState } from "react";
import axios from "axios";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { showMessage, success, failure } from "../../util/messages";

function Comment() {
  const [hasLiked, changeHasLiked] = useState(false);
  const [writingComment, isWritingComment] = useState(false);
  const [hasWrittenComment, changeHasWrittenComment] = useState(false);
  const [oldestFirst, changeSortOrder] = useState(true);

  const [postId, setPost] = useState(null);
  const [numLikes, updateLikes] = useState(null);
  const [comments, updateComments] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:4350/api/post/get_recent_posts`, {
        headers: {
          Authorization: JSON.parse(sessionStorage.getItem("session")).token,
          withCredentials: true,
        },
      })
      .then((r) => {
        /* eslint-disable */
        const id = r.data.data[r.data.data.length - 1]._id;
        setPost(r.data.data[r.data.data.length - 1]._id);
        /* eslint-enable */

        // want to know if the user liked the post to display the like button appropriately
        axios({
          method: "get",
          params: {
            user_id: JSON.parse(sessionStorage.getItem("session")).userId,
            post_id: id,
          },
          url: `http://localhost:4350/api/like/userLikedPost`,
          headers: {
            Authorization: JSON.parse(sessionStorage.getItem("session")).token,
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
            Authorization: JSON.parse(sessionStorage.getItem("session")).token,
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
            Authorization: JSON.parse(sessionStorage.getItem("session")).token,
            withCredentials: true,
          },
        }).then((s) => {
          if (oldestFirst) {
            updateComments(s.data.data);
          } else {
            updateComments(s.data.data.reverse());
          }
        });
      });
  }, [hasWrittenComment]);

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
          Authorization: JSON.parse(sessionStorage.getItem("session")).token,
          withCredentials: true,
        },
        data: {
          post_id: postId,
          user_id: JSON.parse(sessionStorage.getItem("session")).userId,
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
          Authorization: JSON.parse(sessionStorage.getItem("session")).token,
          withCredentials: true,
        },
        data: {
          post_id: postId,
          user_id: JSON.parse(sessionStorage.getItem("session")).userId,
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
          user_id: JSON.parse(sessionStorage.getItem("session")).userId,
          post_id: postId,
          content: commentInput.value.trim(),
        };

        axios({
          method: "post",
          url: `http://localhost:4350/api/comment/create`,
          headers: {
            Authorization: JSON.parse(sessionStorage.getItem("session")).token,
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

  const buttonClicked = "w-6 h-6 fill-blue-400 hover:fill-blue-800";
  const buttonNotClicked = "w-6 h-6 hover:fill-black fill-none";

  return (
    <div>
      <div className="flex">
        <div className="basis-1/2 flex border-r-2 border-black justify-center">
          <div className="flex">
            <button type="button" onClick={likePost}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
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
        <div className="basis-1/2 flex justify-center">
          <div className="flex">
            <button type="button" onClick={writeComment}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
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
            <p className="ml-2">Comment</p>
          </div>
        </div>
      </div>
      {writingComment && (
        <div className="mt-4">
          <p>What&apos;s on your mind?</p>
          <textarea className="resize-none w-full h-32" id="comment_input" />
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
              <div className="flex gap-2 border-black rounded-2xl border-2 p-4 mt-4 bg-white">
                <div className="basis-1/6 lg:basis-1/12 flex justify-center">
                  <img
                    className="rounded-full h-[calc(8rem*0.5)] w-[calc(8rem*0.5)]"
                    src="/sample_profile.jpg"
                    alt="Profile"
                  />
                </div>
                <div className="basis-5/6 lg:basis-11/12">
                  <div className="mb-2 flex justify-between">
                    <p className="font-bold leading-4 text-[1rem]">
                      {comment.username}
                    </p>
                    <p className="leading-4 text-[1rem]">
                      {formatDistanceToNow(new Date(comment.comment_date), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  <div>
                    <p>{comment.content}</p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default Comment;
