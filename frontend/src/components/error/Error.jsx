import React from "react";

import { useNavigate } from "react-router-dom";

function Error() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };

  return (
    <body className="h-screen">
      <main className="grid h-screen place-items-center bg-base-100 py-24 px-6 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-6xl font-bold text-error">404</p>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-simple sm:text-5xl">
            Page not found
          </h1>
          <p className="mt-6 text-base leading-7 text-simple">
            Sorry, we were not able to find the page you’re looking for.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <button
              className="rounded-md bg-neutral px-5 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              type="button"
              onClick={handleClick}
            >
              Back to Home
            </button>
            <a
              href="https://github.com/ShahzaibParacha/COMP-4350-Project/issues"
              className="text-sm inline-flex font-semibold text-simple"
            >
              Report an issue on GitHub
              <span className="ml-1" aria-hidden="true">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-github"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                </svg>
              </span>
              <span className="ml-2" aria-hidden="true">
                &rarr;
              </span>
            </a>
          </div>
        </div>
      </main>
    </body>
  );
}

export default Error;
