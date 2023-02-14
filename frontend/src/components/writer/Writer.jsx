// import React, { useEffect, useState } from "react";
// import axios from "axios";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
// import { useParams } from "react-router-dom";

// eslint-disable-next-line react/prop-types
function Writer() {
  const [writer, setWriter] = useState(null);

  function fetchWriter() {
    // eslint-disable-next-line react/prop-types,camelcase,react/destructuring-assignment
    const sessionUserID = sessionStorage.getItem("session_user_id");
    // eslint-disable-next-line react/prop-types,camelcase,react/destructuring-assignment
    const sessionJWT = sessionStorage.getItem("session_jwt");
    // eslint-disable-next-line no-console
    axios
      .get("http://0.0.0.0:4350/api/user/profile", {
        headers: {
          user_id: sessionUserID,
          Authorization: sessionJWT,
          withCredentials: true,
        },
      })
      .then((r) => setWriter(r))
      // eslint-disable-next-line no-console
      .catch((e) => console.error(e, writer));
  }

  useEffect(() => {
    // eslint-disable-next-line no-console
    fetchWriter();
  }, []);

  return (
    <div className="bg-base-100">
      <div className="grid-rows-1 h-25">
        <div>
          <h1 className="mt-8 text-2xl font-bold ml-12 font-base tracking-tight text-black-800 sm:text-5xl">
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            {sessionStorage.getItem("session_user_id")}'s Profile
          </h1>
        </div>
        <Link
          to={`../writer/${sessionStorage.getItem("session_user_id")}/write`}
          type="button"
        >
          Create a post
        </Link>
      </div>
    </div>
  );
}

export default Writer;
