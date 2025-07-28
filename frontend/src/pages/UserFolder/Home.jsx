/* eslint-disable no-unused-vars */
import React, { useEffect, useState, Suspense } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import Lenis from "@studio-freight/lenis";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { PackageX } from "lucide-react";
import "../../App.css";

const HumanModel = () => {
  const { scene } = useGLTF("/human.glb"); // Place your human.glb in the public folder
  // eslint-disable-next-line react/no-unknown-property
  return <primitive object={scene} scale={2} />;
};

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
    const lenis = new Lenis({
      smooth: true,
      lerp: 0.08,
    });

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
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
      const token =localStorage.getItem("token")
      if (!token) {
        Toastify({
          text: ` First Login then Add to cart ..!! `,
          duration: 3000,
          gravity: "top",
          position: "right",
          style: { background: "red", color: "#fff", borderRadius: "8px", fontWeight: "bold", padding: "12px" },
        }).showToast();
       return navigate('/users/login')
      }

      await axios.post(`${import.meta.env.VITE_BASE_URL}/users/addtocart`, { productId },  {
        headers: { Authorization: `Bearer ${token}` }, // ✅ Token should go inside headers
        withCredentials: true, // ✅ If your backend uses cookies also
      });
      Toastify({
        text: `🛒 ${productName} added to cart!`,
        duration: 3000,
        gravity: "top",
        position: "right",
        style: { background: "blue", color: "#fff", borderRadius: "8px", fontWeight: "bold", padding: "12px" },
      }).showToast();
    } catch (error) {
      console.error("❌ Error adding to cart:", error);
      Toastify({
        text: "❌ Failed to add product to cart",
        duration: 3000,
        gravity: "top",
        position: "right",
        style: { background: "#FF5733", color: "#fff", borderRadius: "8px", fontWeight: "bold", padding: "12px" },
      }).showToast();
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="">
      <motion.div
        className="relative  w-full h-145 bg-gradient-to-r from-white-100 via-red-300 to-blue-600  text-black flex items-center justify-center shadow-md md-grid">
          <div className="left w-1/3 ml-10">
          <h1 className="text-3xl font-semibold">{banners[bannerIndex].title}</h1>
          <p className="text-lg mt-2">{banners[bannerIndex].subtitle}</p></div>
          <div className=" right mr-10 w-1/2">
             <img className="w-200" src={bannersImage[bannerIndex].image} alt="" />

          </div>
      </motion.div></div>

      <div className="container mx-auto mt-6 px-4">
        <input
          type="text"
          placeholder="🔍 Search for products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
      </div>

      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6 text-center">🛍️ Featured Products</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
  {loading
    ? Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="h-72 bg-gray-300 rounded-xl animate-pulse"
        ></div>
      ))
    : filteredProducts.length > 0
    ? filteredProducts.map((product) => (
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
            <div className="relative  h-48 rounded-lg overflow-hidden">
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
            <h2 className="text-lg font-semibold mt-3 truncate">
              {product.name}
            </h2>
            <div className="mt-1">
              {product.discount ? (
                <p className="text-sm text-gray-700">
                  ₹<s className="text-red-500">{product.price}</s>{" "}
                  <span className="text-green-600 font-bold">
                    ₹{product.discount}
                  </span>
                </p>
              ) : (
                <p className="text-sm text-black font-medium">₹{product.price}</p>
              )}
            </div>
          </Link>

          <button
            onClick={() => addToCart(product._id, product.name)}
            className="mt-4 w-full bg-[#d4e4e8] transition-all duration-500 hover:bg-black hover:text-white text-black py-2 rounded-lg "
          >
            🛒 Add to Cart
          </button>
        </motion.div>
      ))
    : (
      <div className="flex flex-col justify-center w-full items-center text-gray-600 mt-7 col-span-full">
        <PackageX size={48} className="text-red-500" />
        <p className="text-lg font-semibold mt-2">Sorry, this product is not found.</p>
        <p className="text-sm">It will be available shortly.</p>
      </div>
    )}
</div>

      </main>


      <Footer />
    </div>
  );
};

export default Home;
