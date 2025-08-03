import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "../../App.css";
import Navbar from "../../components/Navbar"; // ✅ Ensure Navbar is imported

const BuyNowSummary = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("❌ Error fetching product:", error);
        toast.error("❌ Failed to fetch product details!");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // ✅ Load Razorpay SDK script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // ✅ Online Payment Handler
  const handleOnlinePayment = async () => {
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("❌ Razorpay SDK failed to load.");
        return;
      }

      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/payment/create-order`, {
        amount: product.price * 100,
      });

      const { id: order_id, currency, amount } = res.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: "Vishu Store",
        description: `Purchase: ${product.name}`,
        order_id,
        handler: async (response) => {
          try {
            const verify = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/verify-payment`, {
              razorpay_order_id: order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verify.data.message === "Payment verified successfully") {
              toast.success("✅ Payment Successful!");
              navigate(`/users/orderSuccess/${product._id}`);
            } else {
              toast.error("❌ Payment Verification Failed!");
            }
          } catch (err) {
            console.error("❌ Verification Error:", err);
            toast.error("❌ Payment verification failed!");
          }
        },
        prefill: {
          name: "Test User",
          email: "test@example.com",
          contact: "9876543210",
        },
        theme: {
          color: "#0d9488",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error("❌ Payment Error:", err);
      toast.error("❌ Error processing online payment.");
    }
  };

  // ✅ COD Handler
  const handleCOD = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("❌ Please login to continue.");
      return navigate("/users/login");
    }
    navigate(`/users/orderSuccess/${id}`);
  };

  return (
    <div
      className="min-h-screen bg-[#f9f9f9] text-gray-800"
      style={{ fontFamily: '"Gidole", sans-serif' }}
    >
      <ToastContainer />

      {/* Navbar */}
      <div className="absolute top-0 w-full z-50">
        <Navbar />
      </div>

      {/* Header */}
      <div className="pt-28 px-6 w-full max-w-[95vw] mx-auto">
        <h1 className="text-2xl font-bold">CheckOut</h1>
        <div className="bg-amber-950 w-full h-[2px] mt-2"></div>
      </div>

      {/* Main Content */}
      {loading ? (
        <p className="text-center mt-20 text-gray-500 text-xl">Loading product details...</p>
      ) : (
        <div className="w-[90vw] md:w-[80vw] mx-auto mt-5 bg-white shadow-md p-6 rounded-2xl">
          <div className="mb-6">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
              Ready to place your order?
            </h2>
            <p className="text-gray-700">Let's make sure everything is perfect.</p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold">
              Delivers: <span className="text-green-600">Shortly</span>
            </h3>
            <p className="text-sm text-gray-500">Standard Delivery</p>
          </div>

          {product && (
            <div className="border-t pt-4">
              <h3 className="text-xl font-semibold mb-2">Order Summary</h3>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div>
                  <p className="text-lg font-medium text-gray-800">Product: {product.name}</p>
                  <p className="text-md text-gray-600">Price: {product.price}</p>
                </div>
                <div>
                  <img src={product.image.url} className="w-30" alt="" />
                </div>

              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={handleCOD}
              className="w-full bg-gray-800 text-white py-2 rounded hover:bg-black transition"
            >
              Cash on Delivery (COD)
            </button>
            <button
              onClick={handleOnlinePayment}
              className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700 transition"
            >
              Pay Online
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyNowSummary;
