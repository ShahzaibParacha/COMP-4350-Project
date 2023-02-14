import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Home() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const currentSession = {
      session_jwt: window.sessionStorage.getItem("session_jwt"),
      session_user_id: window.sessionStorage.getItem("session_user_id"),
    };
    setSession(currentSession);
    // eslint-disable-next-line no-console
    console.log(session);
  }, []);

  const navigate = useNavigate();

  function handleHomeClick() {
    navigate("/");
  }

  // function handleAuthorClick() {
  //   navigate("/writer", {
  //     params: { id: session.session_user_id },
  //   });
  //   navigate("/writer");
  // }

  function handleLogout() {
    window.sessionStorage.clear();
    navigate("/login");
  }

  return (
    <div className="bg-base-100">
      <div className="grid-rows-1 h-25">
        <button type="button" onClick={handleHomeClick}>
          <h1 className="mt-8 text-2xl font-bold ml-12 font-base tracking-tight text-black-800 sm:text-5xl">
            CASTr
          </h1>
        </button>
        <Link
          to={`writer/${sessionStorage.getItem("session_user_id")}`}
          type="button"
        >
          <h1 className="mt-8 text-2xl font-bold ml-12 font-base tracking-tight text-black-800 sm:text-5xl">
            Profile
          </h1>
        </Link>
        <button type="button" onClick={handleLogout}>
          <h1 className="mt-8 text-2xl font-bold ml-12 font-base tracking-tight text-black-800 sm:text-5xl">
            Logout
          </h1>
        </button>
      </div>

      <div className="grid grid-rows-4 grid-cols-6 gap-4">
        <div className="row-start-1 row-end-5 bg-black-600 row-span-2 h-screen" />
        <div className="row-start-1 col-start-2 col-span-4 row-end-5 h-screen">
          <div className="grid-column-1" />
        </div>
        <div className="row-start-1 row-end-5 h-screen" />
      </div>
    </div>
  );
}

export default Home;
