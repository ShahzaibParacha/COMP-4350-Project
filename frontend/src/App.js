import React from "react";
import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom";
import Home from "./components/home/Home";
import Writer from "./components/writer/Writer";
import Error from "./components/error/Error";
import Login from "./components/login/Login";
import SignUp from "./components/signup/SignUp";
import CreatePost from "./components/createpost/CreatePost";

import "./App.css";
import useAuthContext from "./hooks/useAuthContext";

function App() {
  const { userId } = useAuthContext();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          exact
          path="/"
          element={userId != null ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          exact
          path="/writer/:id"
          element={userId != null ? <Writer /> : <Navigate to="/login" />}
        />
        <Route
          exact
          path="/writer/:id/write"
          element={userId != null ? <CreatePost /> : <Navigate to="/login" />}
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
