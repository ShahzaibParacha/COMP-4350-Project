import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

function Subscribed({ id }) {
  const { userId, token } = JSON.parse(sessionStorage.getItem("session"));
  const [subscribed, setSubscribed] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios({
      method: "get",
      params: {
        user_id: id,
      },
      url: `http://localhost:4350/api/user/subscription/getFollowing`,
      headers: {
        Authorization: token,
        withCredentials: true,
      },
    }).then((result) => {
      setSubscribed(result.data.data);
    });
  }, [id]);

  const enableNotif = (i) => {
    axios({
      method: "post",
      data: {
        user_id: id,
        creator_id: subscribed[i].creator_id,
        set_notification: !subscribed[i].receive_notification,
      },
      url: `http://localhost:4350/api/user/subscription/setNotification`,
      headers: {
        Authorization: token,
        withCredentials: true,
      },
    }).then((s) => {
      if (s.data.code !== 40011) {
        const temp = [...subscribed];
        temp[i].receive_notification = !subscribed[i].receive_notification;
        setSubscribed(temp);
      }
    });
  };

  const unsubscribe = (i) => {
    axios({
      method: "get",
      params: {
        user_id: id,
        creator_id: subscribed[i].creator_id,
      },
      url: `http://localhost:4350/api/user/subscription/cancel`,
      headers: {
        Authorization: token,
        withCredentials: true,
      },
    }).then((s) => {
      if (s.data.code !== 40011) {
        const temp = [...subscribed];
        temp.splice(i, 1);
        setSubscribed(temp);
      }
    });
  };

  const profileClick = (profile) => {
    navigate(`/writer/${profile}`);
  };

  const classIfMyProfile = "font-bold w-[256px] leading-4 text-[1.2rem] py-2";
  const classIfNotMyProfile = "font-bold w-fit leading-4 text-[1.2rem] py-2";

  return (
    subscribed.length > 0 && (
      <div className="w-full mt-4 border-gray-400 border-t-2 pt-2">
        <h2 className="text-center mb-4 text-xl font-bold text-gray-900">
          Writers {userId === id ? "You" : "They"} Follow
        </h2>
        <div className="w-full overflow-auto p-2 max-h-[690px]">
          {subscribed.map((user, i) => (
            <div
              key={user.creator_id}
              className="flex gap-2 items-center justify-between mb-2"
            >
              <div className="flex items-center gap-2 w-fit">
                <button
                  type="button"
                  className="h-[calc(8rem*0.5)] w-[calc(8rem*0.5)]"
                  onClick={() => profileClick(user.creator_id)}
                >
                  <img
                    className="rounded-full object-cover h-full w-full"
                    src={
                      user.profile_photo === null
                        ? "/sample_profile.jpg"
                        : user.profile_photo
                    }
                    alt="Profile"
                  />
                </button>
                <p
                  className={
                    userId === id ? classIfMyProfile : classIfNotMyProfile
                  }
                >
                  {user.username.length <= 10
                    ? user.username
                    : `${user.username.substring(0, 10)}...`}
                </p>
              </div>
              {userId === id && (
                <div className="flex items-center">
                  <button
                    type="button"
                    className="hover:bg-indigo-700 bg-neutral text-white p-2 h-[40px] rounded-l-md"
                    onClick={() => unsubscribe(i)}
                  >
                    Subscribed
                  </button>
                  <button
                    type="button"
                    onClick={() => enableNotif(i)}
                    className="hover:bg-indigo-700 bg-neutral text-white h-[40px] p-2 rounded-r-md"
                  >
                    {user.receive_notification ? (
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
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  );
}

export default Subscribed;

Subscribed.propTypes = {
  // can keep this since it is up to preference according to the doc
  // eslint-disable-next-line
  id: PropTypes.any,
};
