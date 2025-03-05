import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const BuyNowSummary = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("❌ Error fetching product:", error);
        toast.error("Failed to fetch product details! ❌");
      }
    };
    fetchProduct();
  }, [id]);

  const handleCOD = () => {
    toast.success("Order placed successfully with Cash on Delivery!");
    navigate(`/users/orderSuccess/${id}`);

  };

  // ✅ Fixed: Define `loadRazorpayScript`
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


  const handleOnlinePayment = async () => {
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("❌ Razorpay SDK failed to load.");
        return;
      }

      if (!product?.price) {
        toast.error("❌ Product price is missing!");
        return;
      }

      const response = await axios.post("http://localhost:4000/users/create-order", {
        amount: product.price * 100, // Convert ₹ to paise
      });

      if (!response.data || !response.data.id) {
        toast.error("❌ Error creating order with Razorpay.");
        return;
      }

      const { id, currency, amount } = response.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY || "rzp_test_yourKeyHere",
        amount,
        currency,
        name: "Your Store",
        description: `Purchase: ${product.name}`,
        order_id: id,
        handler: async (paymentResponse) => {
          try {
            const verifyRes = await axios.post("http://localhost:4000/users/verify-payment", {
              razorpay_order_id: id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature,
            });

            if (verifyRes.data.message === "Payment verified successfully") {
              toast.success("✅ Payment Successful!");
              navigate("/order-success");
            } else {
              toast.error("❌ Payment Verification Failed!");
            }
          } catch (error) {
            console.error("❌ Error verifying payment:", error);
            toast.error("Payment verification failed!");
          }
        },
        prefill: {
          name: "Your Name",
          email: "your-email@example.com",
          contact: "9876543210",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("❌ Payment Error:", error);
      toast.error("❌ Error processing online payment.");
    }
  };


  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
      <p className="text-gray-600 mb-4">Order Name: {product?.name || "Unknown"}</p>
      <p className="text-gray-600 mb-4">Total Amount: ₹{product?.price || "0"}</p>

      <button
        onClick={handleCOD}
        className="w-full bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-800 mb-3"
      >
        Cash on Delivery (COD)
      </button>

      <button
        onClick={handleOnlinePayment}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
      >
        Pay Online
      </button>
    </div>
  );
};

export default BuyNowSummary;
