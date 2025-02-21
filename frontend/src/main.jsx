/* eslint-disable no-unused-vars */
import React from "react";
import ReactDOM from "react-dom/client";  // ✅ Use "react-dom/client" for React 18
import { BrowserRouter, Routes, Route } from "react-router-dom";

import UserCreate from "./pages/UserCreate";
import UserLogin from "./pages/userLogin";
import userProfile from "./pages/userProfile";
import Home from "./pages/Home";
import "./index.css";


ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/users/register" element={<UserCreate />} />
      <Route path="/users/login" element={<UserLogin />} />
      <Route path="/users/profile" element={<userProfile />} />
    </Routes>
  </BrowserRouter>
);
