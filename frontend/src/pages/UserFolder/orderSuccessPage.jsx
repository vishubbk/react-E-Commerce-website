import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [countdown, setCountdown] = useState(10);

  // ✅ This flag will block double API calls in React 18 StrictMode
  const hasMounted = useRef(false);

  useEffect(() => {
    if (hasMounted.current) return;
    hasMounted.current = true;

    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/products/${id}`);
        setProduct(response.data);
        console.log("Order Details:", response.data);
      } catch (error) {
        console.error("Order Details Error:", error.message);
      }
    };

    const placeOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        await axios.post(
          `${import.meta.env.VITE_BASE_URL}/users/buynowSuccessful/${id}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        toast.success("🎉 Order placed successfully!", {
          position: "top-center",
          autoClose: 3000,
        });
      } catch (error) {
        console.error("Order Error:", error.message);
        toast.error("🚨 Order failed. Please try again.");
      }
    };

    fetchOrderDetails().then(() => placeOrder());

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          navigate("/");
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [id, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <ToastContainer />
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-4">
          🎉 Order Placed Successfully!
        </h2>
        <p className="text-gray-700 mb-2">Thank you for your purchase.</p>

        {product ? (
          <div className="border p-4 rounded-md shadow-sm bg-gray-50 mt-4">
            <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
            <p>Product Name: <strong>{product.name}</strong></p>
            <p>Quantity: <strong>1</strong></p>
            <p>Total Price: <strong>{product.price}</strong></p>
          </div>
        ) : (
          <p className="text-gray-500">Loading order details...</p>
        )}

        <p className="text-gray-500 text-sm mt-4">
          Redirecting to home page in <strong>{countdown}</strong> seconds...
        </p>

        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          ⬅️ Back to HomePage
        </button>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
