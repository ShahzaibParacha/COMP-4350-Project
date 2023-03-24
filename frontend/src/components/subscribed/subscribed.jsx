import React, { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";

function Subscribed({ id }) {
  const { token } = JSON.parse(sessionStorage.getItem("session"));

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
      console.log("here: " + JSON.stringify(result.data.data));
    });
  }, [id]);

  return <div></div>;
}

export default Subscribed;

Subscribed.propTypes = {
  // can keep this since it is up to preference according to the doc
  // eslint-disable-next-line
  id: PropTypes.any,
};
