import { Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import "../../App.css"
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const addToCart = (productName) => {
    Toastify({
      text: `${productName} added to cart!`,
      duration: 3000,
      gravity: "top",
      position: "right",
      backgroundColor: "blue",
    }).showToast();
  };

  return (
    <div className="bg-gray-100 text-gray-800 font-sans min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 py-24 pt-20">
        <h1 className="text-3xl font-bold mb-6 text-center">Product List</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="shadow-lg rounded-lg p-4 animate-pulse bg-gray-300 h-64"
              ></div>
            ))
          ) : products.length > 0 ? (
            products.map((product) => (
              <Link key={product._id} to={`/products/${product._id}`}>
                <div
                  className="shadow-lg rounded-lg p-4 transition-transform transform hover:scale-105 bg-white"
                  style={{ backgroundColor: product.bgcolor, color: product.textcolor }}
                >
                  <div
                    className="rounded-md mb-4 p-2"
                    style={{ backgroundColor: product.panelcolor }}
                  >
                    <img
                      src={product.image?.url || "https://via.placeholder.com/150"}
                      alt="Product"
                      className="w-full h-auto rounded-md object-scale-down max-h-48"
                    />
                  </div>
                  <h2 className="text-lg font-bold mb-2">{product.name}</h2>
                  <p className="text-sm mb-2">
                    Price: {product.discount ? (
                      <>
                        <s className="text-blue-800 font-bold">₹{product.price}</s>{" "}
                        <span className="text-green-600 font-bold">₹{product.discount}</span>
                      </>
                    ) : (
                      <>₹{product.price}</>
                    )}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">Quantity: {product.Details}</p>
                  <button
                    onClick={() => addToCart(product.name)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition duration-300"
                  >
                    <img
                      src="https://img.icons8.com/ios-filled/30/ffffff/add-shopping-cart.png"
                      className="w-5 h-5"
                    />
                    Add to Cart
                  </button>
                </div>
              </Link>
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
