import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!email || !password) {
        toast.error("❌ Please enter both email and password");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/login`,
        { email, password },
        { withCredentials: true } // ✅ Send cookies with the request
      );

      if (response.status === 200) {
        const data = response.data;
        console.log("data", data);

        // ✅ Store Token in Cookies (Expires in 7 days)
        Cookies.set("token", data.token, { expires: 7, secure: true, sameSite: "Strict" });

        toast.success("✅ Login successful!");
        setLoading(false);
        navigate("/");
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
