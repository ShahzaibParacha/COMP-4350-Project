import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import useAuthContext from "../../hooks/useAuthContext";

function Login() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loginStatus, setLoginStatus] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const { dispatch } = useAuthContext();

  useEffect(() => {
    sessionStorage.clear();
    dispatch({ type: "CLEAR", payload: "" });
  }, []);

  const handleEmailAddress = (e) => {
    e.preventDefault();
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    e.preventDefault();
    setPassword(e.target.value);
  };

  function handleLogin(e) {
    e.preventDefault();
    axios
      .post("http://localhost:4350/api/free/user/login", { email, password })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
      })
      .then((res) => {
        if (res.data.msg === "success") {
          setLoginStatus("success");

          setTimeout(() => {
            // need to do this to rerender App.js
            dispatch({ type: "SET_USER_ID", payload: res.data.data.id });
            dispatch({ type: "SET_TOKEN", payload: res.data.data.token });

            sessionStorage.setItem(
              "session",
              JSON.stringify({
                userId: res.data.data.id,
                token: res.data.data.token,
              })
            );

            if (location.state !== null) {
              navigate(`..${location.state}`);
            } else {
              navigate("../");
            }
          }, 2000);
        } else {
          setLoginStatus("failure");
        }
      });
    // eslint-disable-next-line no-console
  }

  function renderFailure() {
    return <p className="text-red-600">Login Failed! Try again</p>;
  }

  function renderSuccess() {
    return (
      <p className="text-green-600">
        Login Succeeded! Redirecting you to your Home page
      </p>
    );
  }

  return (
    <div className="grid h-screen place-items-center bg-base-100 py-12 px-6 sm:py-32 lg:px-8">
      <img
        className="w-[calc(100vw*0.25)] h-[calc(100vw*0.25)] lg:w-[calc(100vw*0.15)] lg:h-[calc(100vw*0.15)] object-cover text-center leading-[calc(100vw*0.25)] lg:leading-[calc(100vw*0.15)] bg-white mb-4"
        src="/logo-white.png"
        alt="CASTr"
      />{" "}
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="font-local text-center text-3xl font-bold tracking-tight text-gray-900">
            Log in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                onChange={handleEmailAddress}
                required
                className="relative font-local block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                onChange={handlePassword}
                required
                className="relative font-local block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative font-local flex w-full justify-center rounded-md border border-transparent bg-neutral py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <span className="absolute font-local inset-y-0 left-0 flex items-center pl-3" />
              Log in
            </button>
          </div>
          <div>{loginStatus === "success" ? renderSuccess() : null}</div>
          <div>{loginStatus === "failure" ? renderFailure() : null}</div>
          <div className="font-local text-center">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={() => {
                navigate("../signup");
              }}
              className="font-local hover:text-green-600"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
