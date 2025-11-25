/* eslint-disable no-unused-vars */
import axios from "axios";
import { motion } from 'framer-motion';
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCcVisa } from "react-icons/fa6";
import { FaEye,FaEyeSlash } from "react-icons/fa";


import Swal from "sweetalert2";
import "../../App.css";
import Navbar from "../../components/Navbar";
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
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // <-- Add payment form state
  const [cardNumber, setCardNumber] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [showCvv, setShowCvv] = useState(false);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {

        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/products/${id}`);
        setProduct(response.data);
        // const  address = user.address?.city || user.address?.street;
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
    // <-- use optional chaining to avoid crash when address is undefined
    const address = user.address?.city || user.address?.street;
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
    setIsProcessing
    setShowPaymentPopup(true);
  };

  // Validate payment details (mock)
  const validatePaymentDetails = async (cardNumberParam, yearParam, cvvParam, monthParam)=>{

    const card = cardNumberParam ?? cardNumber;
    const yearRaw = yearParam ?? expYear;
    const cvvVal = cvvParam ?? cvv;
    const monthRaw = monthParam ?? expMonth;

    // normalize numeric values
    const monthNum = Number((monthRaw || "").toString().trim());
    let yearNum = Number((yearRaw || "").toString().trim());

    // support 2-digit year
    if (!isNaN(yearNum) && yearRaw && yearRaw.toString().length === 2) {
      yearNum = 2000 + yearNum;
    }

    // basic format validation
    const basicValid =
      card?.trim().length === 16 &&
      !isNaN(monthNum) &&
      monthNum >= 1 &&
      monthNum <= 12 &&
      !isNaN(yearNum) &&
      (yearRaw?.toString().trim().length === 4 || yearRaw?.toString().trim().length === 2) &&
      cvvVal?.trim().length === 3;

    if (!basicValid) {
      toast.error("❌ Invalid card details. Check card number, expiry and CVV.");
      return;
    }

    // expiry check against current month/year
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 1-12

    const isExpired = yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth);

    if (isExpired) {
      setShowPaymentPopup(false);
      toast.error("❌ Card expired. Please use a valid card.");
      setCardNumber("");
      setExpMonth("");
      setExpYear("");
      setCvv("");
      return;
    }

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/orders/placeorder`, {
      productId: id,
      amount: product.price,
      paymentMethod: "Online",

    }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          withCredentials: true,
    });

    // If valid and not expired, proceed
    Swal.fire({
      title: "Processing Payment...",
      text: "Please wait a moment.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    setTimeout(() => {
      Swal.close();
      setShowPaymentPopup(false); // close on success
      toast.success("✅ Payment successful!");
      navigate(`/users/orderSuccess/${id}`);
    }, 2000);
  }

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
          <div  style={{  background: THEME.accent, width: 48, height: 3, margin: "0 auto 32px", borderRadius: 2, display : loading ? "none" : "flex"}}></div>

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
    animate={{ x: ["-100%", "0%", "60%"] }}
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
                <div className="flex-1 md:mt-0 lg:-mt-60 flex justify-center items-center">
                  <img
                    src={product.images?.[0]?.url  || "/fallback-image.jpg"}
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
                        src={user?.profilePicture || "https://static.vecteezy.com/system/resources/previews/020/192/489/non_2x/winner-human-or-happy-human-logo-design-vector.jpg"}
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
                  disabled={isProcessing}
                  className="flex-1 py-3 rounded-full text-lg font-semibold shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
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
                  disabled={isProcessing}
                  className="flex-1 py-3  rounded-full text-lg font-semibold shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
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
        {/* PAYMENT POPUP */}
        {showPaymentPopup && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[999] p-4" onClick={() => setShowPaymentPopup(false)}>
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-2xl font-bold text-center mb-6">💳 Secure Payment</h2>

              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-600 mb-2 ml-1">Card Number</label>
                <div className="flex items-center w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus-within:ring-2"
     style={{ "--tw-ring-color": THEME.accent }}>

  <input
    placeholder="XXXX XXXX XXXX XXXX"
    maxLength="16"
    className="w-full outline-none text-gray-700"
    value={cardNumber}
    onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))}
  />

  <FaCcVisa className="text-3xl text-blue-600 ml-2" />
</div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-600 mb-2 ml-1">Expiration Date</label>
                <div className="flex gap-3">
                  <input placeholder="MM" maxLength="2" className="w-1/2 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2" style={{ "--tw-ring-color": THEME.accent }} value={expMonth} onChange={(e) => setExpMonth(e.target.value.replace(/[^\d]/g, "").substring(0, 2))} />
                  <input placeholder="YYYY" maxLength="4" className="w-1/2 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2" style={{ "--tw-ring-color": THEME.accent }} value={expYear} onChange={(e) => setExpYear(e.target.value.replace(/\D/g, "").slice(0, 4))} />
                </div>
              </div>

             <div className="mb-6">
  <label className="block text-sm font-bold text-gray-600 mb-2 ml-1">CVV</label>

  <div className="relative w-1/3">
    <input
      type={showCvv ? "text" : "password"}
      placeholder="CVV"
      maxLength="3"
      className="w-full border border-gray-300 p-3 pr-10 rounded-lg focus:outline-none focus:ring-2"
      style={{ "--tw-ring-color": THEME.accent }}
      value={cvv}
      onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
    />

    {/* Icon inside input field */}
    <button
      type="button"
      onClick={() => setShowCvv(!showCvv)}
      className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-900"
    >
      {showCvv ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
    </button>
  </div>
</div>

              <div className="flex gap-4">
                <button onClick={() => setShowPaymentPopup(false)} className="flex-1 py-3 rounded-xl bg-gray-200 font-semibold hover:bg-gray-300 transition">
                  Cancel
                </button>
                <button onClick={() => validatePaymentDetails()} className="flex-1 py-3 rounded-xl font-semibold text-white transition" style={{ background: THEME.button }}>
                  Pay ₹{product?.price}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default BuyNowSummary;
