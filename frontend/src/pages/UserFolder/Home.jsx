/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import Lenis from "@studio-freight/lenis";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { PackageX } from "lucide-react";
import "../../App.css";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [bannerIndex, setBannerIndex] = useState(0);
  const navigate = useNavigate();

  const banners = [
    { title: "🔥 Mega Sale - Up to 50% Off!", subtitle: "Shop the best deals before they run out!" },
    { title: "🆕 New Arrivals Just Landed!", subtitle: "Explore the latest collection now!" },
    { title: "⚡ Limited Time Offer!", subtitle: "Exclusive discounts on top brands!" },
  ];
  const bannersImage = [
    { image: "https://i.ibb.co/N6qJGLBg/wireless-earbuds-with-neon-cyberpunk-style-lighting-2-removebg-preview.png" },
    { image: "https://i.ibb.co/N6qJGLBg/wireless-earbuds-with-neon-cyberpunk-style-lighting-2-removebg-preview.png" },
    { image: "https://i.ibb.co/mrGH4zrF/wireless-earbuds-with-neon-cyberpunk-style-lighting.png" },
  ];

  useEffect(() => {
    const lenis = new Lenis({ smooth: true, lerp: 0.08 });
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/products`);
        setProducts(response.data);
      } catch (error) {
        console.error("❌ Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setBannerIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const addToCart = async (productId, productName) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        Toastify({
          text: `First login to add to cart.`,
          duration: 3000,
          gravity: "top",
          position: "right",
          style: { background: "red", color: "#fff", borderRadius: "8px", fontWeight: "bold" },
        }).showToast();
        return navigate('/users/login');
      }

      await axios.post(`${import.meta.env.VITE_BASE_URL}/users/addtocart`, { productId }, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      Toastify({
        text: `🛒 ${productName} added to cart!`,
        duration: 3000,
        gravity: "top",
        position: "right",
        style: { background: "blue", color: "#fff", borderRadius: "8px", fontWeight: "bold" },
      }).showToast();
    } catch (error) {
      console.error("❌ Error adding to cart:", error);
      Toastify({
        text: "❌ Failed to add product to cart",
        duration: 3000,
        gravity: "top",
        position: "right",
        style: { background: "#FF5733", color: "#fff", borderRadius: "8px", fontWeight: "bold" },
      }).showToast();
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderProductCard = (product) => (
    <motion.div
      key={product._id}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
      className="relative group bg-white p-4 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-blue-500"
      style={{
        backgroundColor: "#ffffff",
        color: product.textcolor || "#000000",
      }}
    >
      <Link to={`/products/${product._id}`}>
        <div className="relative h-48 rounded-lg overflow-hidden">
          <img
            src={product.image?.url || "https://via.placeholder.com/150"}
            alt={product.name}
            className="w-full h-full object-contain transition-transform duration-500 hover:scale-110"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/150";
              e.target.onerror = null;
            }}
          />
          {product.discount && (
            <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
              Save ₹{product.price - product.discount}
            </span>
          )}
        </div>
        <h2 className="text-lg font-semibold mt-3 truncate">{product.name}</h2>
        <div className="mt-1">
          {product.discount ? (
            <p className="text-sm text-gray-700">
              ₹<s className="text-red-500">{product.price}</s>{" "}
              <span className="text-green-600 font-bold">₹{product.discount}</span>
            </p>
          ) : (
            <p className="text-sm text-black font-medium">₹{product.price}</p>
          )}
        </div>
      </Link>
      <button
        onClick={() => addToCart(product._id, product.name)}
        className="mt-4 w-full bg-[#d4e4e8] hover:bg-black hover:text-white text-black py-2 rounded-lg transition-all duration-500"
      >
        🛒 Add to Cart
      </button>
    </motion.div>
  );

  return (
    <div className="bg-gray-100 min-h-screen" style={{ fontFamily: '"Gidole", sans-serif' }}>
      <div className="absolute top-0"><Navbar /></div>

      {/* Hero Banner */}
      <div className="w-full mt-14">
        <motion.div className="relative w-full min-h-[480px] bg-gradient-to-r from-white via-red-300 to-blue-600 text-black shadow-md flex flex-col md:flex-row items-center justify-between px-4 py-8 gap-6">
          <div className="w-full md:w-1/2 text-center md:text-left px-4 relative">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold">{banners[bannerIndex].title}</h1>
            <p className="text-base md:text-lg mt-2">{banners[bannerIndex].subtitle}</p>
          </div>
          <div className="w-full md:w-1/2 flex justify-center px-4">
            <img
              className="w-full absolute z-10 top-30 max-w-[300px] md:max-w-[400px] h-auto object-contain"
              src={bannersImage[bannerIndex].image}
              alt="Banner"
            />
          </div>
        </motion.div>
      </div>

      {/* Search Bar */}
      <div className="container mx-auto mt-6 px-4">
        <input
          type="text"
          placeholder="🔍 Search for products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
      </div>

      {/* Featured Products */}
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6 text-center">🛍️ Featured Products</h1>

        {/* First 10 products */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {loading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="h-72 bg-gray-300 rounded-xl animate-pulse"></div>
            ))
          ) : filteredProducts.length > 0 ? (
            <>
 {filteredProducts.slice(0, 10).map(renderProductCard)}

 <div className="col-span-full h-100 relative flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-[#27858e] via-red-400   to-[#3a1885] text-white p-6 rounded-2xl overflow-hidden">
  <div className="md:w-1/2 ">
    <img
      src="https://i.ibb.co/fY2pc8c1/LS20250730225719.png"
      alt="Shop Now"
      className="w-80 absolute bottom-0 right-4  md:max-w-[400px] object-contain  "
    />
  </div>
  <div className="md:w-1/2 absolute left-[2%] top-0 text-center md:text-left mt-6 block md:hidden ">
    <h1 className="text-lg md:text-3xl font-extrabold mb-2 text-black">SHOP FOR MORE GADGETS</h1>
    <p className="text-lg w-50 text-blue-200">Grab the Latest Gadgets at Jaw-Dropping Prices!</p>
  </div>

  <div className="md:w-1/2 absolute right-[40%] top-30 text-center md:text-left mt-6 hidden md:block">
  <h1 className="text-2xl md:text-3xl font-extrabold mb-2">SHOP FOR MORE GADGETS</h1>
<p className="text-lg text-green-200">
  Limited Time Offer! <span className="font-semibold text-white">Get 30% OFF</span> on your favorite gadgets – grab the deal now!
</p>

  </div>
<div className="absolute bottom-3 left-[20%] md:left-[40%] ">
  <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className=" bg-[#2e1a1aed] py-2 text-white text-lg font-bold border-b-blue-500 outline-none rounded-2xl hover:bg-black px-9">Shop Now</Link>

  </div>
</div>

            </>

          )  : (
            <div className="flex flex-col justify-center w-full items-center text-gray-600 mt-7 col-span-full">
              <PackageX size={48} className="text-red-500" />
              <p className="text-lg font-semibold mt-2">Sorry, this product is not found.</p>
              <p className="text-sm">It will be available shortly.</p>
            </div>
          )}
        </div>

        {/* Remaining products */}
        {filteredProducts.length > 10 && (
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.slice(10).map(renderProductCard)}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Home;
