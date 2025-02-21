/* eslint-disable no-unused-vars */
import React from "react";
import ReactDOM from "react-dom/client";  // ✅ Use "react-dom/client" for React 18
import { BrowserRouter, Routes, Route } from "react-router-dom";

import UserCreate from "./pages/UserCreate";
import UserLogin from "./pages/userLogin";
import UserProfile from "./pages/userProfile";
import Home from "./pages/Home";
import ProductsDetails from "./pages/ProductsDetails";
import OwnerCreate from "./pages/OwnerCreate";
import OwnerLogin from "./pages/OwnerLogin";
import OwnerDashboard from "./pages/OwnerDashboard";
import "./index.css";


ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/users/register" element={<UserCreate />} />
      <Route path="/users/login" element={<UserLogin />} />
      <Route path="/products/:id" element={<ProductsDetails />} />
      <Route path="/owner/register" element={<OwnerCreate />} />
      <Route path="/owner/login" element={<OwnerLogin />} />
      <Route path="/owner/dashboard" element={<OwnerDashboard />} />
      <Route path="/users/profile" element={<UserProfile />} />

      </Routes>
  </BrowserRouter>
);
