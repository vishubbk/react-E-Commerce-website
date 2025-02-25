import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Create User Account</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <div className="flex flex-col gap-4">
          <div className="fullname flex w-full gap-3">
            <label className="text-gray-700 font-medium w-1/2">
              First Name
              <input
                className="w-full mt-1 border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500"
                type="text"
                placeholder="Enter your first name"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                required
              />
            </label>

            <label className="text-gray-700 font-medium w-1/2">
              Last Name
              <input
                className="w-full mt-1 border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500"
                type="text"
                placeholder="Enter your last name"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                required
              />
            </label>
          </div>

          <label className="text-gray-700 font-medium">
            Email
            <input
              className="w-full mt-1 border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500"
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
              className="w-full mt-1 border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <label className="text-gray-700 font-medium">
            Contact
            <input
              className="w-full mt-1 border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500"
              type="text"
              placeholder="Enter your contact number"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
            />
          </label>
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-all duration-300"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Account"}
        </button>

        <p className="text-gray-700 font-medium mt-3 flex justify-center">
          Already have an account? <Link className="text-blue-500 ml-1" to="/users/login">Login</Link>
        </p>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default UserCreate;
