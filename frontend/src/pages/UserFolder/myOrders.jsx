/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { motion } from 'framer-motion';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("token hai ye",token)
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/myorders`,
          {
            headers: { Authorization: `Bearer ${token}` }, // ✅ Headers me token send karein
            withCredentials: true,
          }
      } catch (error) {
        setError(error.response ? error.response.data.message : "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/users/myorders/${orderId}`, { withCredentials: true });
      setOrders(orders.filter(order => order._id !== orderId));
    } catch (error) {
      setError("Failed to cancel order");
    }
  };

  return (
    <>
 <Navbar className="absolute"/>
    <div className="p-6 relative top-18 max-w-4xl mx-auto">

      <h2 className="text-center text-2xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-md shadow-lg">
        My Orders
      </h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <motion.div
            className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          ></motion.div>
        </div>
      ) : orders.length > 0 ? (
        <div className="grid gap-6">
          {orders.map((order) => (
            <div key={order._id} className="flex items-center border border-gray-300 p-4 rounded-lg shadow-md bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out">
              <img src={order.image?.url || "https://via.placeholder.com/150"} alt={order.name} className="w-24 h-24 object-cover rounded-md mr-4 shadow-lg transition-transform transform hover:scale-105" />
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-gray-800">{order.name}</h3>
                <p className="text-gray-600 font-bold">${order.price}</p>
              </div>
              <button
                onClick={() => handleCancelOrder(order._id)}
                className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
              >
                Cancel Order
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No orders found.</p>
      )}
    <Footer />
    </div>
    </>
  );
};

export default MyOrders;
