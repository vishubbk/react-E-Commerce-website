/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "../../App.css";
import Swal from "sweetalert2";
import Navbar from "../../components/Navbar";
import { motion } from 'framer-motion';
// Apple Store Inspired Theme
const THEME = {
  background: "#f5f6fa",
  card: "#fff",
  accent: "#0071e3",
  accentLight: "#eaf6ff",
  accentDark: "#1d1d1f",
  button: "linear-gradient(90deg, #0071e3 0%, #2997ff 100%)",
  buttonHover: "linear-gradient(90deg, #2997ff 0%, #0071e3 100%)",
  text: "#1d1d1f",
  border: "#e0e0e5",
  shadow: "0 8px 32px 0 rgba(60,60,60,0.08)",
};

const BuyNowSummary = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {

        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/products/${id}`);
        setProduct(response.data);
         const  address = user.address?.city || user.address?.street;
      } catch (error) {
        console.error("❌ Error fetching product:", error);
        toast.error("❌ Failed to fetch product details!");
      }
    };
    fetchProduct();
  }, [id]);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("❌ You need to login first!");
          return navigate("/users/login");
        }

        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        setUser(response.data || {});
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        if (error.response?.status === 401) {
          toast.error("⚠️ Session expired. Please login again.");
          navigate("/users/login");
        } else {
          toast.error("❌ " + (error.response?.data?.message || "Something went wrong."));
        }
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  // Order placed alert
  const showOrderSuccessAlert = () => {
    return Swal.fire({
      title: "🎉 Order Placed!",
      text: "Your Cash on Delivery order was successful.",
      icon: "success",
      confirmButtonText: "OK",
      confirmButtonColor: "#0071e3",
    });
  };

  // COD Order
  const handleCOD = () => {
    const token = localStorage.getItem("token");
    const  address = user.address.city || user.address?.street;
    if (!token ) {
      toast.error("❌ Please login to continue.");
      return navigate("/users/login");
    }

    if (!address ) {
      toast.error("❌ Plz Add Address in Profile");
      return navigate("/users/profile/edit");
    }

    Swal.fire({
      title: "Confirm Cash on Delivery?",
      text: "Do you want to place your order using Cash on Delivery?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Place Order",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Placing your order...",
          text: "Please wait a moment.",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        setTimeout(() => {
          showOrderSuccessAlert().then(() => {
            toast.success("✅ Order confirmed!");
            navigate(`/users/orderSuccess/${id}`);
          });
        }, 1500);
      } else {
        toast.info("🛑 COD order cancelled.");
      }
    });
  };

  // Online payment (Coming Soon)
  const handleOnlinePayment = () => {
    Swal.fire({
      title: "🚧 Online Payment Coming Soon!",
      text: "We're working hard to enable secure online payments. Stay tuned!",
      imageUrl:
        "https://t3.ftcdn.net/jpg/15/78/52/62/240_F_1578526240_jCsGf0TA8yVYQq9a5GiKP4UnlpsXQdKx.jpg",
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: "Coming Soon",
      confirmButtonColor: "#0071e3",
    });
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start"
      style={{
        background: THEME.background,
        color: THEME.text,
        fontFamily: "SF Pro Display, Inter, Arial, sans-serif",
      }}
    >
      <ToastContainer />
      <div className="fixed top-0 left-0 w-full z-50 bg-white border-b border-[#e0e0e5]">
        <Navbar />
      </div>

      <main className="flex flex-col items-center justify-center w-full" style={{ minHeight: "100vh" }}>
        <div className="w-full max-w-xl mx-auto mt-32 mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-2" style={{ color: THEME.accentDark }}>
            Review &amp; Pay
          </h1>
          <div  style={{  background: THEME.accent, width: 48, height: 3, margin: "0 auto 32px", borderRadius: 2, display : setLoading?"none":"flex"}}></div>

          {loading ? (

             
<div style={{ position: "relative", height: 3, marginBottom: 32 }}>
  <motion.div
    style={{
      background: THEME.accent,
      width: 59,
      height: 3,
      borderRadius: 2,
      position: "absolute",
      left: "50%",
      transform: "translateX(-70%)",
    }}
    animate={{ x: ["-100%", "0%", "60%"] }} // centered around 0
   transition={{ duration: 1, repeat: Infinity, repeatType: "mirror" }}
  />
</div>

            
            
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
                    src={product?.image?.url || "/fallback-image.jpg"}
                    alt={product?.name || "Product Image"}
                    className="rounded-2xl object-contain"
                    style={{
                      maxWidth: 220,
                      maxHeight: 220,
                      background: THEME.accentLight,
                      border: `1.5px solid ${THEME.border}`,
                    }}
                  />
                </div>
                <div className="flex-1 flex flex-col justify-center items-center md:items-start">
                  <h2 className="text-2xl font-semibold mb-2" style={{ color: THEME.accentDark }}>
                    {product.name}
                  </h2>
                  <p className="text-lg mb-1" style={{ color: THEME.accent }}>
                    Price: <span className="font-bold">₹{product.price}</span>
                  </p>
                  <p className="text-base text-gray-500 mb-2">
                    Delivered: <span className="text-green-500 font-medium">Shortly</span>
                  </p>
                  <div className="w-full h-[1px] bg-[#e0e0e5] my-3"></div>
                  <p className="text-sm text-gray-400">Standard Delivery</p>

                  <div className="w-full mt-6 p-4 rounded-xl border shadow-sm bg-blue-50" style={{ borderColor: THEME.border }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-base" style={{ color: THEME.accentDark }}>
                        Delivery Address
                      </span>
                      <button
                        className="text-xs px-3 py-1 rounded-full font-medium border border-blue-200 text-blue-700 bg-white hover:bg-blue-50 transition"
                        style={{ borderColor: THEME.accent, color: THEME.accent }}
                        onClick={() => navigate("/users/profile/edit")}
                      >
                        Edit
                      </button>
                    </div>
                    <div className="flex items-center gap-4 mb-2">
                      <img
                        src={user?.profilePicture }
                        alt="User"
                        className="w-10 h-10 rounded-full border border-blue-200 shadow"
                      />
                      <div>
                        <span className="font-bold text-blue-900">
                          {user.firstname} {user.lastname}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-blue-900 leading-relaxed">
                      {user.address?.city && <>{user.address.city}<br /></>}
                      {user.address?.street && <>{user.address.street}<br /></>}
                      {user.contact && <>Phone: {user.contact}<br /></>}
                      {user.email && <>Email: {user.email}</>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full flex flex-col md:flex-row gap-4 mt-6">
                <button
                  onClick={handleCOD}
                  className="flex-1 py-3 rounded-full text-lg font-semibold shadow transition"
                  style={{
                    background: THEME.button,
                    color: "#fff",
                    boxShadow: "0 2px 8px 0 rgba(0,113,227,0.08)",
                  }}
                >
                  Cash on Delivery
                </button>
                <button
                  onClick={handleOnlinePayment}
                  className="flex-1 py-3 rounded-full text-lg font-semibold shadow transition"
                  style={{
                    background: THEME.button,
                    color: "#fff",
                    boxShadow: "0 2px 8px 0 rgba(0,113,227,0.08)",
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
