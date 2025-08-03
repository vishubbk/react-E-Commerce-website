import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Mail, Lock, Phone, User } from "lucide-react";
import "../../App.css";
import "react-toastify/dist/ReactToastify.css";
import { ArrowLeft } from "lucide-react";

const UserCreate = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const isValidContact = (contact) => /^[0-9]{10}$/.test(contact);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstname || !lastname || !email || !password || !contact) {
      toast.error("❌ Please fill all the fields");
      return;
    }
    if (password.length < 4) {
      toast.error("❌ Password must be at least 4 characters long");
      return;
    }
    if (!isValidEmail(email)) {
      toast.error("❌ Please enter a valid email");
      return;
    }
    if (!isValidContact(contact)) {
      toast.error("❌ Please enter a valid contact number (10 digits)");
      return;
    }

    toast.info("🔄 Creating account...", { autoClose: 1000 });
    setLoading(true);

    try {
      const userData = { firstname, lastname, email, password, contact };
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/register`,
        userData
      );

      if (response.status === 201) {
        toast.success("✅ User created successfully!", { autoClose: 2000 });
        setTimeout(() => {
          setFirstname("");
          setLastname("");
          setEmail("");
          setPassword("");
          setContact("");
          setLoading(false);
          navigate("/users/login");
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      toast.error("❌ Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div style={{
      fontFamily: '"Gidole", sans-serif',
      fontWeight: 400,
      fontStyle: "normal",
    }} className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-pink-100 via-purple-200 to-blue-300 px-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Create User Account</h1>
      <button
        className="absolute top-6 left-6 flex items-center text-gray-800 font-medium hover:text-black"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </button>
      <form
        onSubmit={handleSubmit}
        className="backdrop-blur-lg bg-white/40  shadow-xl rounded-2xl p-6 w-full max-w-md "
      >
        <div className="flex flex-col gap-4 ">
          {/* First and Last Name */}
          <div className="flex gap-3">
            {/* First Name */}
            <div className="relative w-1/2">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="First Name"
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
              />
            </div>

            {/* Last Name */}
            <div className="relative w-1/2">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Last Name"
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
              />
            </div>
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="email"
              placeholder="Email"
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Contact */}
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Contact Number"
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-all duration-300"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

          {/* Link to Login */}
          <p className="text-gray-700 font-medium text-center">
            Already have an account?
            <Link className="text-blue-500 ml-1" to="/users/login">
              Login
            </Link>
          </p>
        </div>
      </form>

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

export default UserCreate;
