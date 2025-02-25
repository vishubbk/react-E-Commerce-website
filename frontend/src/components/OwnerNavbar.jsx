import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/users/logout`, {}, { withCredentials: true });

      // ✅ Clear Token
      Cookies.remove("token");
      localStorage.clear();
      sessionStorage.clear();

      toast.success("Logout Successfully", { autoClose: 2000 });

      setTimeout(() => {
        navigate("/users/logout");
        window.location.reload();
      }, 2000); // ✅ Delay navigation to allow toast message to display
    } catch (error) {
      toast.error("Logout Failed. Try Again!");
      console.error("Logout error:", error.response?.data?.message);
    }
  };

  return (
    <>
      {/* Toast Notification */}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Navbar */}
      <header className="backdrop-blur-md shadow-md fixed w-full z-10 bg-white">
        <div className="container mx-auto flex justify-between items-center p-4">
          <div className="flex items-center gap-2">
            <img
              src="https://img.icons8.com/ios-filled/100/4CAF50/shopping-bag.png"
              alt="Logo"
              className="w-8 h-8"
            />
            <h1 className="text-xl font-bold text-gray-800">Shop Mart</h1>
          </div>
          <nav className="hidden lg:flex space-x-6">
            <Link to="/owner/dashboard" className="nav-link">Home</Link>
            <Link to="/owner/Add-Items" className="nav-link">Add-Items</Link>
            <Link to="/owner/All-Items" className="nav-link">All-Items</Link>
            <button onClick={handleLogout} className="logout-btn">LogOut</button>
            <Link to="/owner/profile" className="nav-link">Profile</Link>
          </nav>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden focus:outline-none">
            <img src="https://img.icons8.com/ios-filled/30/000000/menu.png" alt="Menu Icon" />
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 backdrop-blur-md z-20 transition-transform transform ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="w-64 h-full bg-white shadow-lg p-4">
          <button onClick={() => setMobileMenuOpen(false)} className="mb-4 focus:outline-none">
            <img src="https://img.icons8.com/ios-filled/30/000000/close-window.png" alt="Close Icon" />
          </button>
          <nav className="flex flex-col gap-4">
            <Link to="/owner/dashboard" className="mobile-nav-link">Home</Link>
            <Link to="/owner/Add-Items" className="nav-link">Add-Items</Link>
            <Link to="/owner/All-Items" className="nav-link">All-Items</Link>
            <button onClick={handleLogout} className="mobile-logout-btn">LogOut</button>
            <Link to="/owner/profile" className="mobile-nav-link">Profile</Link>
          </nav>
        </div>
      </div>

      {/* Tailwind Styles */}
      <style>
        {`
          .nav-link {
            position: relative;
            font-weight: 500;
            color: #333;
            transition: color 0.3s;
          }

          .nav-link::after {
            content: "";
            position: absolute;
            width: 0;
            height: 2px;
            bottom: -2px;
            left: 50%;
            background-color: #2563eb;
            transition: width 0.3s ease, left 0.3s ease;
          }

          .nav-link:hover {
            color: #2563eb;
          }

          .nav-link:hover::after {
            width: 100%;
            left: 0;
          }

          .logout-btn {
            font-weight: 500;
            color: #dc2626;
            transition: all 0.3s ease;
            border-bottom: 2px solid transparent;
          }

          .logout-btn:hover {
            color: #b91c1c;
            border-bottom: 2px solid #dc2626;
          }

          .mobile-nav-link {
            font-size: 1.1rem;
            font-weight: 500;
            color: #333;
            transition: all 0.3s ease;
          }

          .mobile-nav-link:hover {
            color: #2563eb;
            text-decoration: underline;
          }

          .mobile-logout-btn {
            font-size: 1.1rem;
            font-weight: 500;
            color: #dc2626;
            transition: all 0.3s ease;
          }

          .mobile-logout-btn:hover {
            color: #b91c1c;
            text-decoration: underline;
          }
        `}
      </style>
    </>
  );
};

export default Navbar;
