/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ShoppingCart, ArrowRight } from "lucide-react";
import "./CartItems.css";
import Navbar from "../../components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
const baseURL = import.meta.env.VITE_BASE_URL
import "../../App.css";


const GetCartItems = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("You need to login first.");
          setTimeout(() => navigate("/users/login"), 1000);
          return;
        }
        const response = await axios.get(`${baseURL}/users/getCartItems`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,

        });

        setCartItems(response.data || []);
        console.log(`baseURL ${baseURL}`)
      } catch (error) {
        console.error("Error fetching cart items:", error);
        toast.error("You need to login first.");
        localStorage.removeItem("token");
        setTimeout(() => navigate("/users/login"), 1000);
      } finally {
        setLoading(false);
      }
    };
    fetchCartItems();
  }, []);

  const handleRemoveItem = async (itemId, itemName) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${import.meta.env.VITE_BASE_URL}/users/removeCart/${itemId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setCartItems((prevCart) => prevCart.filter((item) => item._id !== itemId));
      toast.success(`❌ ${itemName} removed from cart!`);
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item! ❌");
    }
  };

  const handleBuyAllItems = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/orders/buy-all`, {}, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      toast.success("🎉 All items purchased successfully!");
      navigate("/checkout");
    } catch (error) {
      console.error("Error processing buy all:", error);
      toast.error("❌ Failed to process purchase!");
    }
  };

  const totalCartPrice = cartItems.reduce(
    (total, item) => total + (Number(item.discount || item.price) * Number(item.quantity || 1)),
    0
  );

  return (
    <div style={{
      fontFamily: '"Gidole", sans-serif',
      fontWeight: 400,
      fontStyle: "normal",
    }}>
    <>
      <Navbar />
      <div className="container mx-auto absolute mt-20 px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center min-h-[50vh]">
            <motion.div
  animate={{
    rotate: [0, 360],
    scale: [1, 1.2, 1],
  }}
  transition={{
    repeat: Infinity,
    duration: 1.5,
    ease: "easeInOut",
  }}
  className="text-blue-600"
>
  <ShoppingCart size={80} />
</motion.div>

            <p className="ml-4 text-xl font-semibold text-gray-600">Loading your cart...</p>
          </div>
        ) : cartItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Shopping Cart ({cartItems.length} items)
              </h2>
              {cartItems.map((item) => (

                <div key={item._id} className="bg-white rounded-lg shadow-md p-4 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                   <Link className="flex" to={`/products/${item._id}`}>
                  <img
                    src={item.image?.url || "https://via.placeholder.com/150"}
                    alt={item.name}
                    className="w-24 h-24  rounded-md"
                  /></Link>

                  <div className="flex-1 space-y-2 text-center sm:text-left ml-8">
                    <h3 className="text-lg font-semibold text-gray-900">{item.name|| "No Name"}</h3>
                    <div className="flex justify-center sm:justify-start items-center space-x-2">
                      ₹<del className="text-gray-500">{item.price}</del>
                      <span className="text-xl font-bold text-gray-900">₹{item.discount || item.price}</span>
                    </div>
                    <p className="text-gray-600 max-h-18 overflow-hidden">
  Detail: {item.details.length > 99 ? `${item.details.substring(0, 99)}...` : item.details}
</p>
                    <div className="flex space-x-3 justify-center sm:justify-start mt-4">
                      <Link
                        to={`/users/buynow/${item._id}`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center justify-center"
                      >
                        Buy Now
                      </Link>

                      <button
                        onClick={() => handleRemoveItem(item._id, item.name)}
                        className="px-4 py-2 cursor-pointer border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">₹{totalCartPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-green-600 font-semibold">Free</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold">Total</span>
                      <span className="text-lg font-bold">₹{totalCartPrice}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleBuyAllItems}
                  className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition font-semibold"
                >
                  Checkout All Items
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-20">
            <ShoppingCart className="w-16 h-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800">Your cart is empty!</h2>
            <Link to="/" className="flex gap-4 mt-5 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Continue Shopping <ArrowRight />
            </Link>
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={2500} hideProgressBar closeOnClick />
    </></div>
  );
};

export default GetCartItems;
