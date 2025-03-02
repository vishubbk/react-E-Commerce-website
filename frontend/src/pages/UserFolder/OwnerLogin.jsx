import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OwnerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!email || !password) {
        toast.error("Please enter email and password");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/owner/login`,
        { email, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success("Login successful!");

        // ✅ Corrected token assignment
       const hh= Cookies.set("token", response.data.token, { expires: 7, secure: true, sameSite: "Strict" });
       console.log(hh);



        setLoading(false);
        navigate("/owner/dashboard");
      }
    } catch (error) {
      setLoading(false);

      if (error.response) {
        const errorMessage = error.response.data.message;

        if (errorMessage === "User already exists") {
          toast.error("User already registered! Please log in.");
          navigate("/owner/login"); // ✅ Redirecting to login page
        } else if (errorMessage === "Invalid credentials") {
          toast.error("Invalid email or password. Try again.");
        } else {
          toast.error("Something went wrong. Please try again.");
        }
      } else {
        toast.error("Network error. Please check your connection.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Owner Login</h1>

      <form className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <label className="text-gray-700 font-medium">
            Email
            <input
              className="w-full mt-1 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="text-gray-700 font-medium">
            Password
            <input
              className="w-full mt-1 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-6 text-white py-3 rounded-md transition-all duration-300 ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-gray-700 font-medium mt-3 flex justify-center">
          Don&apos;t have an account?{" "}
          <Link className="text-blue-500 ml-1" to="/owner/register">
            Create Account
          </Link>
        </p>
      </form>

      <ToastContainer />
    </div>
  );
};

export default OwnerLogin;
