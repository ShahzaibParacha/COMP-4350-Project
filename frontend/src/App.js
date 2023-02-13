import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom";
import Home from "./components/home/Home";
import Writer from "./components/writer/Writer";
import Error from "./components/error/Error";
import Login from "./components/login/Login";
import SignUp from "./components/signup/SignUp";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const session = {
      session_jwt: localStorage.getItem("session_jwt"),
      session_user_id: localStorage.getItem("session_user_id"),
    };
    setUser(session);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          exact
          path="/"
          element={user != null ? <Home /> : <Navigate to="/signup" />}
        />
        <Route
          exact
          path="/writer"
          element={user != null ? <Writer /> : <Navigate to="/signup" />}
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
