import { Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import "../../App.css";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

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
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:4000/products");
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
      await axios.post("http://localhost:4000/users/addtocart", { productId }, { withCredentials: true });
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
      {/* Banner Section */}
      <div className="relative w-full h-56 bg-gradient-to-r from-purple-700 to-pink-600 text-white flex items-center justify-center shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold">{banners[bannerIndex].title}</h1>
          <p className="text-lg mt-2">{banners[bannerIndex].subtitle}</p>
        </div>
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
      {/* Products Section */}
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6 text-center">🛍️ Featured Products</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="h-64 bg-gray-300 rounded-lg animate-pulse"></div>
            ))
            : filteredProducts.length > 0
              ? filteredProducts.map((product) => (
                <div key={product._id} className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition">
                  <Link to={`/products/${product._id}`}>
                    <div className="relative h-48 overflow-hidden rounded-md">
                      <img
                        src={product.image?.url || "https://via.placeholder.com/150"}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-contain hover:scale-105 transition duration-300"
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
                          <s className="text-red-500">₹{product.price}</s> <span className="text-green-600 font-bold">₹{product.discount}</span>
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
                </div>
              ))
              : <p className="text-center text-gray-600">⚠️ No products available.</p>
          }
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
