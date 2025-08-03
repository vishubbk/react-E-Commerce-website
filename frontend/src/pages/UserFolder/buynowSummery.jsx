import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "../../App.css";

// Apple Store Inspired Theme
const THEME = {
  background: "#f5f6fa", // ultra-light gray
  card: "#fff", // pure white card
  accent: "#0071e3", // Apple blue
  accentLight: "#eaf6ff", // light blue
  accentDark: "#1d1d1f", // Apple dark text
  button: "linear-gradient(90deg, #0071e3 0%, #2997ff 100%)", // blue gradient
  buttonHover: "linear-gradient(90deg, #2997ff 0%, #0071e3 100%)",
  text: "#1d1d1f", // Apple dark text
  border: "#e0e0e5", // subtle border
  shadow: "0 8px 32px 0 rgba(60,60,60,0.08)",
};
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
      className="min-h-screen flex flex-col items-center justify-start"
      style={{
        background: THEME.background,
        color: THEME.text,
        fontFamily: 'SF Pro Display, Inter, Arial, sans-serif',
        minHeight: '100vh',
      }}
    >
      <ToastContainer />

      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur border-b border-[#e0e0e5]">
        <Navbar />
      </div>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center w-full" style={{ minHeight: '100vh' }}>
        <div className="w-full max-w-xl mx-auto mt-32 mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-2" style={{ color: THEME.accentDark, letterSpacing: '-0.02em' }}>
            Review &amp; Pay
          </h1>
          <div style={{ background: THEME.accent, width: 48, height: 3, margin: '0 auto 32px', borderRadius: 2 }}></div>

          {loading ? (
            <p className="text-center text-blue-400 text-xl py-24">Loading product details...</p>
          ) : product ? (
            <section
              className="rounded-3xl shadow-xl px-8 py-10 flex flex-col items-center"
              style={{
                background: THEME.card,
                border: `1.5px solid ${THEME.border}`,
                boxShadow: THEME.shadow,
                minHeight: 420,
              }}
            >
              <div className="flex flex-col md:flex-row md:items-center w-full gap-8 mb-8">
                <div className="flex-1 flex justify-center items-center">
                  <img
                    src={product.image.url}
                    alt={product.name}
                    className="rounded-2xl object-contain"
                    style={{ maxWidth: 220, maxHeight: 220, background: THEME.accentLight, border: `1.5px solid ${THEME.border}` }}
                  />
                </div>
                <div className="flex-1 flex flex-col justify-center items-center md:items-start">
                  <h2 className="text-2xl font-semibold mb-2" style={{ color: THEME.accentDark }}>{product.name}</h2>
                  <p className="text-lg mb-1" style={{ color: THEME.accent }}>
                    Price: <span className="font-bold">₹{product.price}</span>
                  </p>
                  <p className="text-base text-gray-500 mb-2">Delivered: <span className="text-green-500 font-medium">Shortly</span></p>
                  <div className="w-full h-[1px] bg-[#e0e0e5] my-3"></div>
                  <p className="text-sm text-gray-400">Standard Delivery</p>
                </div>
              </div>

              <div className="w-full flex flex-col md:flex-row gap-4 mt-6">
                <button
                  onClick={handleCOD}
                  className="flex-1 py-3 rounded-full text-lg font-semibold shadow transition border-none"
                  style={{
                    background: THEME.button,
                    color: '#fff',
                    boxShadow: '0 2px 8px 0 rgba(0,113,227,0.08)',
                  }}
                
                >
                  Cash on Delivery
                </button>
                <button
                  onClick={handleOnlinePayment}
                  className="flex-1 py-3 rounded-full text-lg font-semibold shadow transition border-none"
                  style={{
                    background: THEME.button,
                    color: '#fff',
                    boxShadow: '0 2px 8px 0 rgba(0,113,227,0.08)',
                  }}
                 
                >
                  Pay Online
                </button>
              </div>
            </section>
          ) : (
            <div className="text-center text-gray-400 py-24">
              <p className="text-xl">Product not found.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BuyNowSummary;
