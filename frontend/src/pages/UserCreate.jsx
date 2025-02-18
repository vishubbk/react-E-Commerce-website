import React from "react";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from "react-router-dom";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

const Register = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    Toastify({
      text: "Account created successfully!",
      duration: 3000,
      gravity: "top",
      position: "center",
      backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
    }).showToast();
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">Create User Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
            <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm" required />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">Create Account</button>
        </form>
        <p className="text-sm text-center text-gray-600 mt-4">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};



const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/users/register" element={<Register />} />

      </Routes>
    </Router>
  );
};

export default App;