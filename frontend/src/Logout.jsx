import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear user session data
    Cookies.remove("token");
    localStorage.clear();
    sessionStorage.clear();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold text-red-600">User Logged Out Successfully</h1>
        <p className="text-gray-600 mt-2">You have been logged out of your account.</p>
        <button
          onClick={() => navigate("/users/login")}
          className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default Logout;
