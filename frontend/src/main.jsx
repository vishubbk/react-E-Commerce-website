/* eslint-disable no-unused-vars */
import React from "react";
import ReactDOM from "react-dom/client";  // ✅ Use "react-dom/client" for React 18
import { BrowserRouter, Routes, Route } from "react-router-dom";

import UserCreate from "./pages/UserFolder/userCreate";
import UserLogin from "./pages/UserFolder/userLogin";
import UserProfile from "./pages/UserFolder/userProfile";
import UserProfileEdit from "./pages/UserFolder/UserProfileEdit";
import UserCart from "./pages/UserFolder/getCartItems";
import Buynow from "./pages/UserFolder/buynowSummery";
import MyOrders from './pages/UserFolder/MyOrders'
import Home from "./pages/UserFolder/Home";
import ProductsDetails from "./pages/UserFolder/ProductsDetails";
import OrderSuccess from "./pages/UserFolder/orderSuccessPage";
import RouteProtection from "./pages/UserFolder/RouteProtection";
import Logout from "./Logout";

import OwnerCreate from "./pages/UserFolder/OwnerCreate";
import OwnerLogin from "./pages/UserFolder/OwnerLogin";
import OwnerDashboard from "./pages/OwnerFolder/OwnerDashboard";
import OwnerAllItems from "./pages/OwnerFolder/AllItems";
import OwnerAddItems from "./pages/OwnerFolder/AddItems";
import OwnerProfile from "./pages/OwnerFolder/Profile";
import OwnerProfileEdit from "./pages/OwnerFolder/EditProfile";
import OwnerAllOrders from "./pages/OwnerFolder/AllOrdersShow";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      {/* Home Route */}
      <Route path="/" element={<Home />} />

      {/* User Routes */}
      <Route path="/users/register" element={<UserCreate />} />  {/* User Registration */}
      <Route path="/users/login" element={<UserLogin />} />  {/* User Login */}
      <Route path="/users/profile" element={<UserProfile />} />  {/* User Profile */}
      <Route path="/users/profile/edit" element={<UserProfileEdit />} />  {/* Edit User Profile */}
      <Route path="/users/getCartItems" element={<UserCart />} />  {/* User Cart Page */}
      <Route path="/users/buynow/:id" element={<Buynow />} />  {/* Buy Now Checkout */}
      <Route path="/users/orderSuccess/:id" element={<OrderSuccess />} />  {/* Order Success Page */}
      <Route path="/users/logout" element={<Logout />} />  {/* Logout */}
      <Route path="/users/Order" element={<MyOrders />} />  {/* Order-Page */}

      {/* Owner Routes */}
      <Route path="/owner/register" element={<OwnerCreate />} />  {/* Owner Registration */}
      <Route path="/owner/login" element={<OwnerLogin />} />  {/* Owner Login */}
      <Route path="/owner/dashboard" element={<OwnerDashboard />} />  {/* Owner Dashboard */}
      <Route path="/owner/All-Items" element={<OwnerAllItems />} />  {/* View All Items */}
      <Route path="/owner/Add-Items" element={<OwnerAddItems />} />  {/* Add New Items */}
      <Route path="/owner/Profile" element={<OwnerProfile />} />  {/* Owner Profile */}
      <Route path="/owner/editProfile" element={<OwnerProfileEdit />} />  {/* Edit Owner Profile */}
      <Route path="/owner/AllOrders" element={<OwnerAllOrders />} />  {/* Edit Owner Profile */}

      {/* Product Routes */}
      <Route path="/products/:id" element={<ProductsDetails />} />  {/* Product Details Page */}

      {/* Route Protection - Handles unauthorized access */}
      <Route path="*" element={<RouteProtection />} />  {/* Default route for unauthorized pages */}
    </Routes>
  </BrowserRouter>
);
