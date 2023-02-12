import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  function handleHomeClick() {
    navigate("/");
  }

  return (
    <body className="bg-base-100">
      <div className="grid-rows-1 h-20">
        <button type="button" onClick={handleHomeClick}>
          <h1 className="mt-8 text-2xl font-bold ml-12 font-base tracking-tight text-black-800 sm:text-5xl">
            CASTr
          </h1>
        </button>
      </div>

      <div className="flex">
        <div className="w-1/4 bg-base-100 h-12" />
        <div className="w-2/4 bg-gray-200 h-screen" />
        <div className="w-2/4 bg-gray-200 h-screen" />
        <div className="w-1/4 bg-base-100 h-screen " />
      </div>
    </body>
  );
}

export default Home;
