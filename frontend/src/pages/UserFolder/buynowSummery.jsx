import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

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
        toast.error("Failed to fetch product details! ❌");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // ✅ Load Razorpay script
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

  // ✅ Handle online payment
  const handleOnlinePayment = async () => {
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("❌ Razorpay SDK failed to load.");
        return;
      }

      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/payment/create-order`, {
        amount: product.price * 100,
      });


      const { id: order_id, currency, amount } = response.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // ✅ Test or Live Key from .env
        amount,
        currency,
        name: "Vishu Store",
        description: `Purchase: ${product.name}`,
        order_id,
        handler: async (paymentResponse) => {
          try {
            const verifyRes = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/verify-payment`, {
              razorpay_order_id: order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature,
            });

            if (verifyRes.data.message === "Payment verified successfully") {
              toast.success("✅ Payment Successful!");
              navigate(`/users/orderSuccess/${product._id}`);
            } else {
              toast.error("❌ Payment Verification Failed!");
            }
          } catch (error) {
            console.error("❌ Error verifying payment:", error);
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
    } catch (error) {
      console.error("❌ Payment Error:", error);
      toast.error("❌ Error processing online payment.");
    }
  };

  const handleCOD = () => {
    navigate(`/users/orderSuccess/${id}`);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      {loading ? (
        <p className="text-center text-gray-500">Loading product details...</p>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
          <p className="text-gray-700 mb-2">Product: <span className="font-semibold">{product?.name}</span></p>
          <p className="text-gray-700 mb-6">Price: ₹<span className="font-semibold">{product?.price}</span></p>

          <button
            onClick={handleCOD}
            className="w-full bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-800 mb-3"
          >
            Cash on Delivery (COD)
          </button>

          <button
            onClick={handleOnlinePayment}
            className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition-all"
          >
            Pay Online
          </button>
        </>
      )}
    </div>
  );
};

export default BuyNowSummary;
