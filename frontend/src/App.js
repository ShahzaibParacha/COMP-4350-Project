import React from "react";
import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom";
import Home from "./components/home/Home";
import Writer from "./components/writer/Writer";
import Error from "./components/error/Error";
import Login from "./components/login/Login";
import SignUp from "./components/signup/SignUp";
import CreatePost from "./components/createpost/CreatePost";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          exact
          path="/"
          element={
            window.sessionStorage.getItem("session_user_id") != null ? (
              <Home />
            ) : (
              <Navigate to="/signup" />
            )
          }
        />
        <Route
          exact
          path="/writer/:id"
          element={
            window.sessionStorage.getItem("session_user_id") != null ? (
              <Writer />
            ) : (
              <Navigate to="/signup" />
            )
          }
        />
        <Route
          exact
          path="/writer/:id/write"
          element={
            window.sessionStorage.getItem("session_user_id") != null ? (
              <CreatePost />
            ) : (
              <Navigate to="/signup" />
            )
          }
        />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signup" element={<SignUp />} />
        <Route exact path="/404" element={<Error />} />
        <Route path="*" element={<Navigate to="/404" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
