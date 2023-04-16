import React from "react";
import { Route, Navigate, Routes, useLocation } from "react-router-dom";
import Home from "./components/home/Home";
import Writer from "./components/writer/Writer";
import NotFound from "./components/notfound/NotFound";
import Login from "./components/login/Login";
import SignUp from "./components/signup/SignUp";
import CreatePost from "./components/createpost/CreatePost";
import ViewPost from "./components/viewpost/ViewPost";

import "./App.css";
import useAuthContext from "./hooks/useAuthContext";
import Navbar from "./components/navbar/Navbar";

function App() {
  // using the context will make this rerender if there's a change to the state
  // using session storage will allow us to save the state even after refresh
  const { userId, token } = useAuthContext();
  const session = JSON.parse(sessionStorage.getItem("session"));
  const location = useLocation();

  if (userId && token && !session) {
    sessionStorage.setItem(
      "session",
      JSON.stringify({
        userId,
        token,
      })
    );
  }

  return (
    <div>
      {userId !== null || session !== null ? <Navbar /> : null}
      <Routes>
        <Route
          exact
          path="/"
          element={
            userId != null || session != null ? (
              <Home />
            ) : (
              <Navigate to="/login" state={location.pathname} />
            )
          }
        />
        <Route
          exact
          path="/writer/:id"
          element={
            userId != null || session != null ? (
              <Writer />
            ) : (
              <Navigate to="/login" state={location.pathname} />
            )
          }
        />
        <Route
          exact
          path="/writer/:id/write"
          element={
            userId != null || session != null ? (
              <CreatePost />
            ) : (
              <Navigate to="/login" state={location.pathname} />
            )
          }
        />
        <Route
          exact
          path="/post/:id"
          element={
            userId != null || session != null ? (
              <ViewPost />
            ) : (
              <Navigate to="/login" state={location.pathname} />
            )
          }
        />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signup" element={<SignUp />} />
        <Route exact path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" />} />
      </Routes>
    </div>
  );
}

export default App;
