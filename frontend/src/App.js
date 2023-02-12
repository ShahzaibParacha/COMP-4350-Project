import React from "react";
import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom";
import Home from "./components/home/Home";
import Error from "./components/error/Error";
import Login from "./components/login/Login";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/404" element={<Error />} />
        <Route path="*" element={<Navigate to="/404" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
