import React from 'react'
import { Link } from "react-router-dom";
import "../../App.css";

const RouteProtection = () => {
  return (
    <div style={{
      fontFamily: '"Gidole", sans-serif',
      fontWeight: 400,
      fontStyle: "normal",
    }} className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
    <h1 className="text-5xl font-bold text-red-500">404</h1>
    <p className="text-xl text-gray-700 mt-4">Oops! The page you are looking for does not exist.</p>
    <Link to="/" className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
      Go Back Home
    </Link>
  </div>
  )
}

export default RouteProtection
