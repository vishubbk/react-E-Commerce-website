import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  ShoppingCart,
  Home,
  LogOut,
  ShoppingBag,
  User,
  Menu,
  X,
  Package,
} from "lucide-react";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/logout`,
        {},
        { withCredentials: true }
      );

      Cookies.remove("token");
      localStorage.clear();
      sessionStorage.clear();

      toast.success("Logout Successfully", { autoClose: 2000 });

      setTimeout(() => {
        navigate("/users/logout");
        window.location.reload();
      }, 2000);
    } catch (error) {
      toast.error("Logout Failed. Try Again!");
      console.error("Logout error:", error.response?.data?.message);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Navbar Header */}
      <header className="backdrop-blur-md shadow-md fixed w-full z-10 bg-white/90">
        <div className="container mx-auto flex justify-between items-center p-4">
          <Link to={`/`}><div className="flex items-center gap-2">
            <Package className="w-8 h-8 text-green-600" />
            <h1 className="text-xl font-bold text-gray-800">Shop Mart</h1>
          </div></Link>


          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-6">
            {[
              { path: "/", label: "Home", icon: Home },
              { path: "/users/getCartItems", label: "My Cart", icon: ShoppingBag },
              { path: "/users/Order", label: "Orders", icon: ShoppingCart },
              { path: "/users/profile", label: "Profile", icon: User },
            ].map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`nav-link flex items-center gap-2 ${
                  location.pathname === path ? "active" : ""
                }`}
              >
                <Icon size={20} />
                <span>{label}</span>
              </Link>
            ))}




            {isLoggedIn ? (
              <button onClick={handleLogout} className="logout-btn flex items-center gap-2">
                <LogOut size={20} />
                <span>LogOut</span>
              </button>
            ) : (
              <Link
                to="/users/login"
                className="nav-link flex items-center gap-2"
              >
                <User size={20} />
                <span>Login</span>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden focus:outline-none"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Mobile Nav */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-20 transition-opacity duration-300 ${
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`w-72 h-full bg-white shadow-lg p-6 transition-transform duration-300 ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center mb-6">
            <Link to={`/`}>
            <div className="flex items-center gap-2">
              <Package className="w-6 h-6 text-green-600" />
              <span className="font-semibold">Shop Mart</span>
            </div>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="focus:outline-none"
            >
              <X size={24} />
            </button>
          </div>

          <nav className="flex flex-col gap-4">
            {[
              { path: "/", label: "Home", icon: Home },
              { path: "/users/getCartItems", label: "My Cart", icon: ShoppingBag },
              { path: "/users/Order", label: "Orders", icon: ShoppingCart },
              { path: "/users/profile", label: "Profile", icon: User },
            ].map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`mobile-nav-link flex items-center gap-3 ${
                  location.pathname === path ? "active" : ""
                }`}
              >
                <Icon size={20} />
                <span>{label}</span>
              </Link>
            ))}

            {isLoggedIn ? (
              <button onClick={handleLogout} className="mobile-logout-btn flex items-center gap-2">
                <LogOut size={20} />
                <span>LogOut</span>
              </button>
            ) : (
              <Link
                to="/users/login"
                className="mobile-nav-link flex items-center gap-3"
              >
                <User size={20} />
                <span>Login</span>
              </Link>
            )}
          </nav>
        </div>
      </div>

      {/* Custom Styles */}
      <style>
        {`
          .nav-link {
            font-weight: 500;
            color: #374151;
            transition: all 0.3s ease;
            padding: 0.5rem 0.75rem;
            border-radius: 0.375rem;
          }

          .nav-link:hover {
            color: #2563eb;
            background-color: #f3f4f6;
          }

          .logout-btn {
            font-weight: 500;
            color: #dc2626;
            transition: all 0.3s ease;
            padding: 0.5rem 0.75rem;
            border-radius: 0.375rem;
          }

          .logout-btn:hover {
            background-color: #fef2f2;
            color: #b91c1c;
          }

          .mobile-nav-link {
            font-size: 1rem;
            font-weight: 500;
            color: #374151;
            transition: all 0.3s ease;
            padding: 0.75rem;
            border-radius: 0.375rem;
          }

          .mobile-nav-link:hover {
            color: #2563eb;
            background-color: #f3f4f6;
          }

          .mobile-logout-btn {
            width: 100%;
            font-size: 1rem;
            font-weight: 500;
            color: #dc2626;
            transition: all 0.3s ease;
            padding: 0.75rem;
            border-radius: 0.375rem;
            text-align: left;
          }

          .mobile-logout-btn:hover {
            background-color: #fef2f2;
            color: #b91c1c;
          }

          .nav-link.active, .mobile-nav-link.active {
            color: #2563eb;
            background-color: #eff6ff;
            font-weight: 600;
          }
        `}
      </style>
    </>
  );
};

export default Navbar;
