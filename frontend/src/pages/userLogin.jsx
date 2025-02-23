import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Function to Get Cookies and Log Errors
  const getCookies = () => {
    const cookies = document.cookie;
    console.log("Cookies in browser:", cookies);

    if (!cookies.includes("token")) {
      console.error("❌ Cookie 'token' is missing! Make sure backend is setting it properly.");
    }
  };

  // ✅ Handle Login Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!email || !password) {
        toast.error("❌ Please enter both email and password");
        console.error("❌ Error: Email or Password is missing.");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/login`,
        { email, password },
        { withCredentials: true } // ✅ Ensures cookies are included
      );

      if (response.status === 200) {
        toast.success("✅ Login successful!");
        console.log("✅ Server Response:", response.data);
        setLoading(false);
        getCookies(); // ✅ Logs cookies after successful login
        navigate("/");
      }
    } catch (error) {
      setLoading(false);
      console.error("❌ Login Error:", error);

      // 🔴 Handle Different Error Cases
      if (error.response) {
        console.error("❌ Server Response Error:", error.response.data);
        toast.error(`❌ ${error.response.data.message || "Login failed!"}`);
      } else if (error.request) {
        console.error("❌ No response from server. Possible network issue.");
        toast.error("❌ Server not responding. Check your internet connection.");
      } else {
        console.error("❌ Request Error:", error.message);
        toast.error("❌ Something went wrong!");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Login</h1>
      <form className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <label className="text-gray-700 font-medium">
            Email
            <input className="w-full mt-1 border border-gray-300 rounded-md p-3" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>

          <label className="text-gray-700 font-medium">
            Password
            <input className="w-full mt-1 border border-gray-300 rounded-md p-3" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
        </div>

        <button type="submit" disabled={loading} className="w-full mt-6 bg-blue-600 text-white py-3 rounded-md">
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-gray-700 font-medium mt-3">
          Don't have an account? <Link className="text-blue-500" to="/users/register">Create Account</Link>
        </p>
      </form>
      <ToastContainer />
    </div>
  );
};

export default UserLogin;
