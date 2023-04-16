import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuthContext from "../../hooks/useAuthContext";

function SignUp() {
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loginStatus, setLoginStatus] = useState("");
  const navigate = useNavigate();
  const { dispatch } = useAuthContext();

  useEffect(() => {
    sessionStorage.clear();
    dispatch({ type: "CLEAR", payload: "" });
  }, []);

  const handleUsername = (e) => {
    e.preventDefault();
    setUsername(e.target.value);
  };

  const handleEmailAddress = (e) => {
    e.preventDefault();
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    e.preventDefault();
    setPassword(e.target.value);
  };

  function renderFailure() {
    return <p className="text-red-600">Signup Failed! Try again</p>;
  }

  function renderSuccess() {
    return (
      <p className="text-green-600">
        Signup Succeeded! Redirecting you to the Login page
      </p>
    );
  }

  function handleSignUp(e) {
    e.preventDefault();
    axios
      .post("http://localhost:4350/api/free/user/signup", {
        username,
        email,
        password,
        isWriter: true,
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
      })
      .then((res) => {
        // eslint-disable-next-line no-console
        console.log(res.data.msg);
        if (res.data.msg === "success") {
          setLoginStatus("success");
          setTimeout(() => {
            navigate("../login", { state: null });
          }, 2000);
        } else {
          setLoginStatus("failure");
        }
      });
  }

  return (
    <div className="grid h-screen place-items-center bg-base-100 py-12 px-6 sm:py-32 lg:px-8">
      <img
        className="w-[calc(100vw*0.25)] h-[calc(100vw*0.25)] lg:w-[calc(100vw*0.15)] lg:h-[calc(100vw*0.15)] object-cover text-center leading-[calc(100vw*0.25)] lg:leading-[calc(100vw*0.15)] bg-white"
        src="/logo-white.png"
        alt="CASTr"
      />{" "}
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="font-local text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign up for an account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSignUp}>
          <div className="-space-y-px rounded-md shadow-sm">
            <div className="-space-y-px rounded-md shadow-sm">
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="email-address" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="username"
                autoComplete="username"
                onChange={handleUsername}
                required
                className="relative font-local block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Username"
              />
            </div>
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
                className="relative font-local block w-full appearance-none rounded-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
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
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-neutral py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <span className="absolute font-local inset-y-0 left-0 flex items-center pl-3" />
              Sign up
            </button>
          </div>
          <div>{loginStatus === "success" ? renderSuccess() : null}</div>
          <div>{loginStatus === "failure" ? renderFailure() : null}</div>
          <div className="font-local text-center">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => {
                navigate("../login");
              }}
              className="hover:text-green-600"
            >
              Log in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
