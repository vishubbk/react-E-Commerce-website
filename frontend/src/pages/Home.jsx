import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../App.css"
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

const Home = ({ products = [] }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Ensure SwiperJS is initialized if needed
    // Example: new Swiper(".swiper-container", { ...swiperConfig });
  }, []);

  const addToCart = (productName) => {
    Toastify({
      text: `${productName} added to cart!`,
      duration: 3000,
      gravity: "top",
      position: "right",
      backgroundColor: "green",
    }).showToast();
  };

  return (
    <div className="bg-gray-100 text-gray-800 font-sans min-h-screen">
      {/* Navbar */}
      <header className="navbar text-gray-800 py-4 fixed w-full z-10 bg-white shadow-md">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="flex items-center gap-2">
            <img src="https://img.icons8.com/ios-filled/100/4CAF50/shopping-bag.png" alt="Logo" className="w-8 h-8" />
            <h1 className="text-xl font-bold">Shop Mart</h1>
          </div>
          <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden text-gray-800 focus:outline-none">
            <img src="https://img.icons8.com/ios-filled/30/000000/menu.png" alt="Menu Icon" />
          </button>
          <nav className="hidden lg:flex items-center gap-6">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <Link to="/cart" className="hover:text-blue-600">My Cart</Link>
            <Link to="/users/logout" className="hover:text-blue-600">LogOut</Link>
            <Link to="/users/profile" className="hover:text-blue-600">Profile</Link>
          </nav>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-20 flex justify-end">
          <div className="bg-white w-64 h-full shadow-lg p-4">
            <button onClick={() => setMobileMenuOpen(false)} className="text-gray-800 focus:outline-none mb-4">
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
      )}

      {/* Main Section */}
      <main className="container mx-auto px-4 py-24 pt-20">
        <h1 className="text-3xl font-bold mb-6 text-center">Product List</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <Link key={product._id} to={`/users/shop/${product._id}`}>
                <div className="shadow-lg rounded-lg p-4 transition-transform transform hover:scale-105"
                     style={{ backgroundColor: product.bgcolor, color: product.textcolor }}>
                  <div className="rounded-md mb-4 p-2" style={{ backgroundColor: product.panelcolor }}>
                    <img src={product.image?.url || "https://via.placeholder.com/150"} alt="Product"
                         className="w-full h-auto rounded-md object-scale-down max-h-48" />
                  </div>
                  <h2 className="text-lg font-bold mb-2">{product.name}</h2>
                  <p className="text-sm mb-2">
                    Price: {product.discount ? (
                      <>
                        <s className="text-blue-800 font-bold">₹{product.price}</s>{" "}
                        <span className="text-green-600 font-bold">₹{product.discount}</span>
                      </>
                    ) : (
                      <>₹{product.price}</>
                    )}
                  </p>
                  <button onClick={() => addToCart(product.name)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition duration-300">
                    <img src="https://img.icons8.com/ios-filled/30/ffffff/add-shopping-cart.png" className="w-5 h-5" />
                    Add to Cart
                  </button>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-600">No products available.</p>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-4 pt-6 text-center text-gray-600">
        <p className="text-sm">&copy; 2025. Vishu-A. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
