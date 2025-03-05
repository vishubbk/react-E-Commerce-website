import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowLeft } from "lucide-react";

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
        { withCredentials: true } // ✅ Ensure credentials are sent
      );

      if (response.status === 200) {
        const data = response.data;

        // ✅ Get cookies securely
        Cookies.set("token", data.token, { expires: 7, secure: true, sameSite: "None" });

        toast.success("✅ Login Successful!", { autoClose: 2000 });

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <button className="absolute top-6 left-6 flex items-center text-gray-700" onClick={() => navigate("/")}>
        <ArrowLeft className="w-5 h-5 mr-2" /> Back
      </button>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Login</h1>
      <form className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md" onSubmit={handleSubmit}>
        {/* Form Fields */}
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default UserLogin;
