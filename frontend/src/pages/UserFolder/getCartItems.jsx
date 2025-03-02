/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ShoppingCart, ArrowRight } from "lucide-react";
import "./CartItems.css";
import Navbar from "../../components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GetCartItems = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get("http://localhost:4000/users/getCartItems", {
          withCredentials: true,
        });
        setCartItems(response.data || []);
      } catch (error) {
        console.error("Error fetching cart items:", error);
        toast.error("Failed to fetch cart items! ❌");
        if (error.response?.status === 401 || error.response?.status === 403) {
          navigate("/users/login");
        }
      }
    };
    fetchCartItems();
  }, []);

  const handleRemoveItem = async (itemId, itemName) => {
    try {
      await axios.post(`http://localhost:4000/users/removeCart/${itemId}`, {}, { withCredentials: true });
      setCartItems((prevCart) => prevCart.filter((item) => item._id !== itemId));
      toast.success(`❌ ${itemName} removed from cart!`);
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item! ❌");
    }
  };

  const totalCartPrice = cartItems.reduce(
    (total, item) => total + (Number(item.discount || item.price) * Number(item.quantity || 1)),
    0
  );

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async () => {
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("❌ Razorpay SDK failed to load. Check your internet connection.");
        return;
      }
      if (totalCartPrice <= 0) {
        toast.error("Cart is empty or has invalid items! ❌");
        return;
      }
      const response = await axios.post("http://localhost:4000/api/payments/create-order", {
        amount: totalCartPrice * 100,
      });
      const { id, amount, currency } = response.data;
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: amount,
        currency: currency,
        name: "Shop Mart",
        description: "Purchase from Shop Mart",
        order_id: id,
        handler: function (response) {
          toast.success("✅ Payment Successful!");
          console.log("Payment Details:", response);
        },
        prefill: {
          name: "Your Name",
          email: "your-email@example.com",
          contact: "9876543210",
        },
        theme: { color: "#3399cc" },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("❌ Payment failed:", error);
      toast.error("❌ Payment failed!");
    }
  };

  return (
    <>
      <Navbar className="absolute" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart ({cartItems.length} items)</h2>
              {cartItems.map((item) => (
                <div key={item._id} className="bg-white rounded-lg shadow-md p-4 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <img src={item.image?.url || "https://via.placeholder.com/150"} alt={item.name} className="w-24 h-24 object-cover rounded-md" />
                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <h3 className="text-lg font-semibold text-gray-900">{item.name || "No Name"}</h3>
                    <div className="flex justify-center sm:justify-start items-center space-x-2">
                      <del className="text-gray-500">₹{item.price}</del>
                      <span className="text-xl font-bold text-gray-900">₹{item.discount || item.price}</span>
                    </div>
                    <button onClick={() => handleRemoveItem(item._id, item.name)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition">Remove</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total</span>
                  <span className="font-semibold">₹{totalCartPrice}</span>
                </div>
                <button onClick={handleCheckout} className="w-full py-3 mt-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition font-semibold">Checkout</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-20">
            <ShoppingCart className="w-16 h-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800">Your cart is empty!</h2>
            <Link to="/" className="mt-5 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Continue Shopping <ArrowRight /></Link>
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={2500} hideProgressBar closeOnClick />
    </>
  );
};

export default GetCartItems;
