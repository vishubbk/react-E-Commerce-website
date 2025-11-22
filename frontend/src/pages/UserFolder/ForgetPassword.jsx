import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowLeft, Mail, Lock, Key } from "lucide-react";
import "../../App.css";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [newpassword, setNewpassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0); // ⏳ Timer state
  const navigate = useNavigate();

  // 🔄 Handle OTP countdown
  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // ✅ Send OTP
  const otpGenerate = async () => {
    if (!email) {
      toast.error("❌ Please enter your email before requesting OTP");
      return;
    }
    setOtpTimer(120); // ⏳ Start 2 minutes countdown
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/send-otp`,
        { email }
      );
      if (response.status === 200) {
        toast.success("✅ OTP sent! Please check your email.", {
          autoClose: 2000,
        });
      }
    } catch (error) {
      if (error.response) {
        toast.error(`❌ ${error.response.data.message || "Request failed!"}`);
      } else if (error.request) {
        toast.error(
          "❌ Server not responding. Check your internet connection."
        );
      } else {
        toast.error("❌ Something went wrong!");
      }
    }
  };

  // ✅ Reset Password
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !newpassword || !otp) {
      toast.error("❌ Please fill all fields");
      return;
    }

    toast.info("🔄 Resetting password...", { autoClose: 1000 });
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/reset-password`,
        { email, otp, newpassword }
      );

      if (response.status === 200) {
        toast.success("✅ Password reset successful!", { autoClose: 3000 });
        setEmail("");
        setOtp("");
        setNewpassword("");
        setTimeout(() => {
          setLoading(false);
          navigate("/users/login");
        }, 3000);
      }
    } catch (error) {
      setLoading(false);
      if (error.response) {
        toast.error(`❌ ${error.response.data.message || "Request failed!"}`);
      } else if (error.request) {
        toast.error(
          "❌ Server not responding. Check your internet connection."
        );
      } else {
        toast.error("❌ Something went wrong!");
      }
    }
  };

  return (
    <div
      style={{
        fontFamily: '"Gidole", sans-serif',
        fontWeight: 400,
        fontStyle: "normal",
      }}
      className="min-h-screen w-full bg-gradient-to-r from-pink-100 via-purple-200 to-blue-300 flex items-center justify-center px-4 relative"
    >
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
          Forget Password 🔑
        </h1>
        <p className="text-center text-gray-600 mb-6">
          <span className="text-blue-600 text-center mr-4">
            Enter your email to receive a code.
          </span>
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email Field */}
          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* New Password Field */}
          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="password"
              placeholder="Enter your New Password"
              value={newpassword}
              onChange={(e) => setNewpassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* OTP Field */}
          <div className="relative flex">
            <Key
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <abbr title="ONLY [0-9] DIGITS ARE ALLOWED IN OTP">
               <input
              type="text" // text use karo taaki maxlength work kare
              inputMode="numeric" // mobile pe number keypad aayega
              placeholder="Enter your OTP"
              maxLength={4} // sirf 4 digit tak allow karega
              value={otp}
              onChange={(e) => {
                // sirf numbers allow karna
                const value = e.target.value.replace(/[^0-9]/g, "");
                setOtp(value);
              }}
              className="w-full pl-10 pr-28 py-3 border border-gray-300 rounded-lg focus:outline-none"
            />
            </abbr>
           

            <button
              type="button"
              onClick={otpGenerate}
              disabled={otpTimer > 0}
              className={`absolute disabled:cursor-not-allowed right-2 top-1/2 transform -translate-y-1/2 font-semibold px-3 py-2 rounded-lg cursor-pointer ${
                otpTimer > 0
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-blue-300 hover:bg-blue-400 text-black"
              }`}
            >
              {otpTimer > 0
                ? `Resend in ${Math.floor(otpTimer / 120)}:${String(
                    otpTimer % 120
                  ).padStart(2, "0")}`
                : "Send OTP"}
            </button>
          </div>

          {/* Reset Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 transition text-white py-3 rounded-lg font-semibold shadow-md"
          >
            {loading ? "Processing..." : "Reset Password"}
          </button>

          {/* Back to login */}
          <p className="text-center text-gray-700 mt-3">
            Remembered your password?{" "}
            <Link
              to="/users/login"
              className="text-purple-600 font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </div>

      {/* Background Illustration */}
      <img
        src="https://media.publit.io/file/w_646,h_548,c_fit,q_80/chrmpWebsite/group-8-2.svg"
        alt="Illustration"
        className="absolute bottom-0 right-0 w-[300px] opacity-40 hidden md:block"
      />

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ForgetPassword;
