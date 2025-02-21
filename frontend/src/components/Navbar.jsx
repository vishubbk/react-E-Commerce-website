import { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Navbar */}
      <header className="backdrop-blur-md shadow-md fixed w-full z-10">
        <div className="container mx-auto flex justify-between items-center p-4">
          <div className="flex items-center gap-2">
            <img src="https://img.icons8.com/ios-filled/100/4CAF50/shopping-bag.png" alt="Logo" className="w-8 h-8" />
            <h1 className="text-xl font-bold">Shop Mart</h1>
          </div>
          <nav className="hidden lg:flex space-x-6">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <Link to="/cart" className="hover:text-blue-600">My Cart</Link>
            <Link to="/users/logout" className="hover:text-blue-600">LogOut</Link>
            <Link to="/users/profile" className="hover:text-blue-600">Profile</Link>
          </nav>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden focus:outline-none">
            <img src="https://img.icons8.com/ios-filled/30/000000/menu.png" alt="Menu Icon" />
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 backdrop-blur-md z-20 transition-transform transform ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="w-64 h-full bg-white shadow-lg p-4">
          <button onClick={() => setMobileMenuOpen(false)} className="mb-4 focus:outline-none">
            <img src="https://img.icons8.com/ios-filled/30/000000/close-window.png" alt="Close Icon" />
          </button>
          <nav className="flex flex-col gap-4">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <Link to="/cart" className="hover:text-blue-600">My Cart</Link>
            <Link to="/users/logout" className="hover:text-blue-600">LogOut</Link>
            <Link to="/users/profile" className="hover:text-blue-600">Profile</Link>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;