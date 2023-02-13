import React, { useState } from "react";
import axios from "axios";

function SignUp() {
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

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

  function handleLogin(e) {
    e.preventDefault();
    axios
      .post("http://0.0.0.0:4350/api/free/user/signup", {
        username,
        email,
        password,
        isWriter: true,
      })
      .catch((error) => {
        // eslint-disable-next-line no-alert
        alert(error);
        // eslint-disable-next-line no-console
        console.log(error);
      })
      .then((res) => {
        // eslint-disable-next-line no-alert
        alert(res);
        // eslint-disable-next-line no-console
        console.log(res);
      });
    // eslint-disable-next-line no-console
    console.log(email, password, username);
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
            Sign up for an account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
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
                className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
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
                className="relative block w-full appearance-none rounded-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
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
              Sign up
            </button>
          </div>
          <div className="text-center">
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            Already have an account? <a href="../login">Log in</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
