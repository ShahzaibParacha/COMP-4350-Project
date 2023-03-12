import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import useAuthContext from "../../hooks/useAuthContext";
import { fromContextToSession } from "../../util/state";

function Login() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loginStatus, setLoginStatus] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const { dispatch } = useAuthContext();

  useEffect(() => {
    fromContextToSession(null, null);
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

          setLoginStatus("success");

          if (location.state !== null) {
            navigate(`..${location.state}`);
          } else {
            navigate("../");
          }
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
    return <p className="text-green-600">Login Succeeded!</p>;
  }

  return (
    <div className="grid h-screen place-items-center bg-base-100 py-24 px-6 sm:py-32 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          {/* <img */}
          {/*  className="mx-auto h-12 w-auto" */}
          {/*  src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" */}
          {/*  alt="Your Company" */}
          {/* /> */}
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
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
                className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
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
                className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-neutral py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <span className="absolute inset-y-0 left-0 flex items-center pl-3" />
              Log in
            </button>
          </div>
          <div>{loginStatus === "success" ? renderSuccess() : null}</div>
          <div>{loginStatus === "failure" ? renderFailure() : null}</div>
          <div className="text-center">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={() => {
                navigate("../signup");
              }}
              className="hover:text-green-600"
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
