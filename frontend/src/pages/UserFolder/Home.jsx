import React, { useEffect, useState, Suspense } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import Lenis from "@studio-freight/lenis";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { PackageX } from "lucide-react";
import "../../App.css";

const HumanModel = () => {
  const { scene } = useGLTF("/human.glb"); // Place your human.glb in the public folder
  return <primitive object={scene} scale={2} />;
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [bannerIndex, setBannerIndex] = useState(0);

  const banners = [
    { title: "🔥 Mega Sale - Up to 50% Off!", subtitle: "Shop the best deals before they run out!" },
    { title: "🆕 New Arrivals Just Landed!", subtitle: "Explore the latest collection now!" },
    { title: "⚡ Limited Time Offer!", subtitle: "Exclusive discounts on top brands!" },
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
      <motion.div
        className="relative w-full h-56 bg-gradient-to-r from-purple-700 to-pink-600 text-white flex items-center justify-center shadow-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="text-center mt-15">
          <h1 className="text-3xl font-bold">{banners[bannerIndex].title}</h1>
          <p className="text-lg mt-2">{banners[bannerIndex].subtitle}</p>
        </div>
      </motion.div>

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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="h-64 bg-gray-300 rounded-lg animate-pulse"></div>
              ))
            : filteredProducts.length > 0
            ? filteredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition cursor-pointer"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                  whileHover={{ scale: 1.05, rotate: 1 }}
                >
                  <Link to={`/products/${product._id}`}>
                    <div className="relative h-48 overflow-hidden rounded-md">
                      <img
                        src={product.image?.url || "https://via.placeholder.com/150"}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-contain hover:scale-110 transition duration-500"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/150";
                          e.target.onerror = null;
                        }}
                      />
                    </div>
                    <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
                    <p className="text-gray-600 mt-1">
                      {product.discount ? (
                        <>
                          <s className="text-red-500">₹{product.price}</s>{" "}
                          <span className="text-green-600 font-bold">₹{product.discount}</span>
                        </>
                      ) : (
                        <>₹{product.price}</>
                      )}
                    </p>
                  </Link>
                  <button
                    onClick={() => addToCart(product._id, product.name)}
                    className="mt-3 w-full bg-blue-600 text-white py-2 rounded-md flex items-center justify-center gap-2 hover:bg-blue-700 transition"
                  >
                    🛒 Add to Cart
                  </button>
                </motion.div>
              ))
            : (
              <div className="flex flex-col justify-center w-[83vw] items-center text-gray-600 mt-7">
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
