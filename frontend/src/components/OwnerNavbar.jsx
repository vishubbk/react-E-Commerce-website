import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LayoutDashboard, Package, LogOut, User, Menu, X, PlusCircle, List } from "lucide-react";

const OwnerNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/users/logout`, {}, { withCredentials: true });

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
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <header className="backdrop-blur-md shadow-md fixed w-full z-10 bg-white/90">
        <div className="container mx-auto flex justify-between items-center p-4">
          <div className="flex items-center gap-2">
            <Package className="w-8 h-8 text-green-600" />
            <h1 className="text-xl font-bold text-gray-800">Owner Panel</h1>
          </div>

          <nav className="hidden lg:flex items-center space-x-6">
            <Link to="/owner/dashboard" className={`nav-link flex items-center gap-2 ${location.pathname === '/owner/dashboard' ? 'active' : ''}`}>
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </Link>
            <Link to="/owner/Add-Items" className={`nav-link flex items-center gap-2 ${location.pathname === '/owner/Add-Items' ? 'active' : ''}`}>
              <PlusCircle size={20} />
              <span>Add Items</span>
            </Link>
            <Link to="/owner/All-Items" className={`nav-link flex items-center gap-2 ${location.pathname === '/owner/All-Items' ? 'active' : ''}`}>
              <List size={20} />
              <span>All Items</span>
            </Link>
            <Link to="/owner/AllOrders" className={`nav-link flex items-center gap-2 ${location.pathname === '/owner/All-Items' ? 'active' : ''}`}>
              <List size={20} />
              <span>All Orders</span>
            </Link>
            <Link to="/owner/profile" className={`nav-link flex items-center gap-2 ${location.pathname === '/owner/profile' ? 'active' : ''}`}>
              <User size={20} />
              <span>Profile</span>
            </Link>
            <button onClick={handleLogout} className="logout-btn flex items-center gap-2">
              <LogOut size={20} />
              <span>LogOut</span>
            </button>
          </nav>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden focus:outline-none">
            <Menu size={24} />
          </button>
        </div>
      </header>

      <div className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-20 transition-opacity duration-300 ${mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <div className={`w-72 h-full bg-white shadow-lg p-6 transition-transform duration-300 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Package className="w-6 h-6 text-green-600" />
              <span className="font-semibold">Owner Panel</span>
            </div>
            <button onClick={() => setMobileMenuOpen(false)} className="focus:outline-none">
              <X size={24} />
            </button>
          </div>

          <nav className="flex flex-col gap-4">
            <Link to="/owner/dashboard" className={`mobile-nav-link flex items-center gap-3 ${location.pathname === '/owner/dashboard' ? 'active' : ''}`}>
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </Link>
            <Link to="/owner/Add-Items" className={`mobile-nav-link flex items-center gap-3 ${location.pathname === '/owner/Add-Items' ? 'active' : ''}`}>
              <PlusCircle size={20} />
              <span>Add Items</span>
            </Link>
            <Link to="/owner/All-Items" className={`mobile-nav-link flex items-center gap-3 ${location.pathname === '/owner/All-Items' ? 'active' : ''}`}>
              <List size={20} />
              <span>All Items</span>
            </Link>
            <Link to="/owner/AllOrders" className={`mobile-nav-link flex items-center gap-3 ${location.pathname === '/owner/All-Items' ? 'active' : ''}`}>
              <List size={20} />
              <span>All Items</span>
            </Link>
            <Link to="/owner/profile" className={`mobile-nav-link flex items-center gap-3 ${location.pathname === '/owner/profile' ? 'active' : ''}`}>
              <User size={20} />
              <span>Profile</span>
            </Link>
            <button onClick={handleLogout} className="mobile-logout-btn flex items-center gap-2">
              <LogOut size={20} />
              <span>LogOut</span>
            </button>
          </nav>
        </div>
      </div>
    </>
  );
};

export default OwnerNavbar;
