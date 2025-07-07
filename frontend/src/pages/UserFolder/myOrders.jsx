/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { motion } from 'framer-motion';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/users/login");
          return;
        }

        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/myorders`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setOrders(response?.data?.orders || []);
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          toast.error("You need to login first.");
          setTimeout(() => navigate("/users/login"), 1000);
        } else {
          setError(error.response?.data?.message || "Failed to fetch orders");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const handleCancelOrder = async (orderId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/users/myorders/${orderId}`, { withCredentials: true });
      setOrders(orders.filter(order => order._id !== orderId));
      alert('Order cancelled successfully');
    } catch (error) {
      setError("Failed to cancel order");
    }
  };

  return (
    <>
      <Navbar className="absolute" />
      <div className="p-6 relative top-18 max-w-4xl mx-auto">

        <h2 className="text-center text-2xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-md shadow-lg">
          My Orders
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
            <span onClick={() => setError(null)} className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer">×</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <motion.div
              className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            ></motion.div>
          </div>
        ) : (Array.isArray(orders) && orders.length > 0) ? (
          <div className="grid gap-6">
            {orders.map((order) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                layout
                className="flex items-center border border-gray-300 p-4 rounded-lg shadow-md bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out"
              >
                {/* Wrap image and product name inside the Link */}
                <Link to={`/products/${order._id}`} className="flex items-center flex-grow hover:underline">
                  <img src={order.image?.url || "https://via.placeholder.com/150"} alt={order.name} className="w-24 h-24 object-cover rounded-md mr-4 shadow-lg transition-transform transform hover:scale-105" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{order.name}</h3>
                    <p className="text-gray-600 font-bold">₹{order.price}</p>
                  </div>
                </Link>
                <button
                  onClick={() => handleCancelOrder(order._id)}
                  className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
                >
                  Cancel Order
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <img src="https://via.placeholder.com/200x150?text=No+Orders" alt="No Orders" className="mx-auto mb-4" />
            <p>No orders found.</p>
          </div>
        )}
        <Footer />
      </div>
    </>
  );
};

export default MyOrders;
