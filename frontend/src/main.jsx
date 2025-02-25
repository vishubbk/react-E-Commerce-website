/* eslint-disable no-unused-vars */
import React from "react";
import ReactDOM from "react-dom/client";  // ✅ Use "react-dom/client" for React 18
import { BrowserRouter, Routes, Route } from "react-router-dom";

import UserCreate from "./pages/UserFolder/userCreate";
import UserLogin from "./pages/UserFolder/userLogin";
import UserProfile from "./pages/UserFolder/userProfile";
import Home from "./pages/UserFolder/Home";
import ProductsDetails from "./pages/UserFolder/ProductsDetails";
import OwnerCreate from "./pages/UserFolder/OwnerCreate";
import OwnerLogin from "./pages/UserFolder/OwnerLogin";
import OwnerDashboard from "./pages/OwnerFolder/OwnerDashboard";
import UserProfileEdit from "./pages/UserFolder/UserProfileEdit";
import Logout from "./Logout";
import "./index.css";
import RouteProtection from "./pages/UserFolder/RouteProtection"

import OwnerAllItems from "./pages/OwnerFolder/AllItems";
import OwnerAddItems from "./pages/OwnerFolder/AddItems";
import OwnerProfile from "./pages/OwnerFolder/Profile";


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
      <Route path="/users/profile/edit" element={<UserProfileEdit />} />
      <Route path="/users/logout" element={<Logout />} />
      <Route path="/owner/All-Items" element={<OwnerAllItems />} />
      <Route path="/owner/Add-Items" element={<OwnerAddItems />} />
      <Route path="/owner/Profile" element={<OwnerProfile />} />
      <Route path="*" element={<RouteProtection />} />

      </Routes>
  </BrowserRouter>
);
