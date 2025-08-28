import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import confetti from "canvas-confetti";

const Logout = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Clear user session data
    Cookies.remove("token");
    localStorage.clear();
    sessionStorage.clear();

    // Trigger confetti effect multiple times
    const interval = setInterval(() => {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.6 },
      });
    }, 700);

    setTimeout(() => clearInterval(interval), 3000);

    // Start countdown
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    // Redirect after countdown
    setTimeout(() => {
      navigate("/users/login");
    }, 5000);

    return () => {
      clearInterval(timer);
      clearInterval(interval);
    };
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 relative overflow-hidden">
      {/* floating background circles */}
      <div className="absolute w-72 h-72 bg-white/20 rounded-full blur-3xl top-20 left-10 animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-pink-300/30 rounded-full blur-3xl bottom-10 right-10 animate-ping"></div>

      {/* Logout Card */}
      <div className="relative bg-white/30 backdrop-blur-lg p-10 rounded-3xl shadow-2xl text-center max-w-md mx-4 transform transition-all duration-500 hover:scale-105 border border-white/40">
        <div className="mb-6">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-200 flex items-center justify-center animate-bounce">
            <svg
              className="w-12 h-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 drop-shadow mb-3">
            Logged Out 🎉
          </h1>
          <p className="text-gray-700 text-lg mb-4">
            You’ve been successfully logged out
          </p>
          <p className="text-sm text-gray-600 font-medium">
            Redirecting in <span className="font-bold">{countdown}</span>{" "}
            seconds...
          </p>
        </div>

        <button
          onClick={() => navigate("/users/login")}
          className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default Logout;
