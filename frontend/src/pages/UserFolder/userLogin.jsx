import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowLeft, Lock, Mail } from "lucide-react";
import "../../App.css";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("❌ Please enter both email and password");
      return;
    }

    toast.info("🔄 Logging in...", { autoClose: 1000 });
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/login`,
        { email, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success("✅ Login Successful!", { autoClose: 2000 });
        localStorage.setItem("token", response.data.token);

        setTimeout(() => {
          setLoading(false);
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      setLoading(false);
      if (error.response) {
        toast.error(`❌ ${error.response.data.message || "Login failed!"}`);
      } else if (error.request) {
        toast.error("❌ Server not responding. Check your internet connection.");
      } else {
        toast.error("❌ Something went wrong!");
      }
    }
  };

  return (
    <div style={{
      fontFamily: '"Gidole", sans-serif',
      fontWeight: 400,
      fontStyle: "normal",
    }} className="min-h-screen w-full bg-gradient-to-r from-pink-100 via-purple-200 to-blue-300 flex items-center justify-center px-4 relative">

      {/* Back Button */}
      <button
        className="absolute top-6 left-6 flex items-center text-gray-800 font-medium hover:text-black"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </button>

      {/* Form Container */}
      <div className="backdrop-blur-lg bg-white/40 shadow-2xl rounded-2xl p-8 w-full max-w-md z-10">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Welcome Back 👋
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Login to continue shopping
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email Field */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 transition text-white py-3 rounded-lg font-semibold shadow-md"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Register Link */}
          <p className="text-center text-gray-700 mt-3">
            Don't have an account?{" "}
            <Link to="/users/register" className="text-purple-600 font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>

      {/* Background Illustration (Optional) */}
      <img
        src="https://media.publit.io/file/w_646,h_548,c_fit,q_80/chrmpWebsite/group-8-2.svg"
        alt="Illustration"
        className="absolute bottom-0 right-0 w-[300px] opacity-40 hidden md:block"
      />

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default UserLogin;
