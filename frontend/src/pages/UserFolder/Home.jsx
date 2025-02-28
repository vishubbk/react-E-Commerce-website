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
    { title: "Mega Sale - Up to 50% Off!", subtitle: "Shop the best deals before they run out!" },
    { title: "New Arrivals Just Landed!", subtitle: "Explore the latest collection now!" },
    { title: "Limited Time Offer!", subtitle: "Exclusive discounts on top brands!" }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:4000/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
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

  const addToCart = (productName) => {
    Toastify({
      text: `${productName} added to cart!`,
      duration: 3000,
      gravity: "top",
      position: "right",
      backgroundColor: "blue",
    }).showToast();
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-50 text-gray-900 font-sans min-h-screen ">
      <Navbar className="absolute" />

      {/* Banner */}
      <div className="bg-gradient-to-r from-[#2e2e66] to-[#971b7e] relative top-8 text-white py-12 text-center shadow-md">
        <h1 className="text-4xl font-extrabold">{banners[bannerIndex].title}</h1>
        <p className="text-lg mt-2 font-medium">{banners[bannerIndex].subtitle}</p>
      </div>

      {/* Search Bar */}
      <div className="container mx-auto mt-6 px-4 relative top-4.5">
        <input
          type="text"
          placeholder="Search for products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-4 border border-gray-700 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-center">Products</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="shadow-md rounded-lg p-6 animate-pulse bg-gray-300 h-64"
              ></div>
            ))
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product._id} className="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition duration-300">
                <Link to={`/products/${product._id}`}>
                  <div className="rounded-md overflow-hidden">
                    <img
                      src={product.image?.url || "https://via.placeholder.com/150"}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-md hover:scale-105 transition duration-300"
                    />
                  </div>
                  <h2 className="text-lg font-semibold mt-4">{product.name}</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {product.discount ? (
                      <>
                        <s className="text-red-500 font-medium">₹{product.price}</s>{" "}
                        <span className="text-green-600 font-bold">₹{product.discount}</span>
                      </>
                    ) : (
                      <>₹{product.price}</>
                    )}
                  </p>
                  <p className="text-sm text-gray-500">Quantity: {product.Details}</p>
                </Link>
                <button
                  onClick={() => addToCart(product.name)}
                  className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 transition duration-300"
                >
                  <img
                    src="https://img.icons8.com/ios-filled/30/ffffff/add-shopping-cart.png"
                    className="w-5 h-5"
                  />
                  Add to Cart
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">No products available.</p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
