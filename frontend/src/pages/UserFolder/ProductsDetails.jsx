import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../UserFolder/modern.css";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

const ProductsDetails = () => {
  const [loader, setLoader] = useState(false);
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();

  // Handle image selection
  useEffect(() => {
    if (product?.images?.length > 0) {
      setSelectedImage(0);
    }
  }, [product]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoader(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/products/${id}`
        );
        setProduct(response.data);
      } catch (error) {
        console.error("❌ Error fetching product:", error);
        toast.error("Failed to fetch product details! ❌");
      } finally {
        setLoader(false);
      }
    };

    fetchProduct();
  }, [id]);

  const addToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        Toastify({
          text: `You need to login first.!! `,
          duration: 3000,
          gravity: "top",
          position: "right",
          style: {
            background: "red",
            color: "#fff",
            borderRadius: "8px",
            fontWeight: "bold",
            padding: "12px",
          },
        }).showToast();
        navigate(`/users/login`);
        return;
      }
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/addtocart`,
        { productId: id },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      toast.success("Product added to cart successfully! ✅");
    } catch (error) {
      console.error("❌ Error adding product to cart:", error);
      toast.error("Failed to add product to cart. ❌");
    }
  };

  const handleBuynow = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      Toastify({
        text: `You need to login first.!!`,
        duration: 3000,
        gravity: "top",
        position: "right",
        style: {
          background: "red",
          color: "#fff",
          borderRadius: "8px",
          fontWeight: "bold",
          padding: "12px",
        },
      }).showToast();
      navigate(`/users/login`);
      return;
    }

    navigate(`/users/buynow/${product._id}`);
  };

  // Calculate discount percentage safely
  const discountPercent =
    product && product.price && product.discount
      ? Math.round(((product.price - product.discount) / product.price) * 100)
      : 0;

  return (
    <>
      <Navbar />

      <div className="container mx-auto px-4 py-24 pt-20 flex flex-col items-center mb-20">
        {loader ? (
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="text-blue-600 mb-4"
            >
              <ShoppingBag size={80} />
            </motion.div>
            <p className="text-lg text-gray-700 font-semibold">
              Loading Product...
            </p>
          </div>
        ) : !product ? (
          <div className="w-full max-w-4xl p-6 bg-white shadow-lg rounded-lg animate-pulse">
            <div className="h-64 bg-gray-300 rounded-md mb-4"></div>
            <div className="h-6 bg-gray-300 w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-300 w-1/2 mb-3"></div>
            <div className="h-4 bg-gray-300 w-1/3 mb-3"></div>
            <div className="h-10 bg-gray-300 w-full rounded-md"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white shadow-xl rounded-lg p-6">
            {/* Product Images Gallery */}
            <div className="flex flex-col space-y-4">
              {/* Main Image */}
              <div className="flex justify-center">
                <img
                  src={
                    product.images?.[selectedImage]?.url ||
                    product.image?.url ||
                    "https://via.placeholder.com/400x400?text=No+Image"
                  }
                  alt={product.name}
                  className="w-full max-w-lg h-96 object-contain rounded-md shadow-md  transition-transform duration-300"
                  loading="lazy"
                />
              </div>

              {/* Thumbnail Scroll */}
              {product.images && product.images.length > 1 && (
                <div className="flex overflow-x-auto space-x-4 pb-4 px-2 scrollbar-thin scroll-smooth">
                  {product.images.map((img, index) => (
                    <img
                      key={index}
                      src={img.url}
                      alt={`${product.name} view ${index + 1}`}
                      className={`w-24 h-24 object-cover rounded-md cursor-pointer transition-all duration-200 
                        ${
                          selectedImage === index
                            ? "border-2 border-blue-500 shadow-lg scale-105"
                            : "border border-gray-200 opacity-70 hover:opacity-100 hover:scale-105"
                        }`}
                      onClick={() => setSelectedImage(index)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-center text-center md:text-left">
              <h1 className="text-2xl font-bold mb-4 text-gray-800">
                {product.name}
              </h1>
              <div className="rating flex gap-3 my-2 mb-4 items-center">
                <div className="bg-green-700 text-white font-lg w-fit px-2 py-1 rounded-lg">
                  3.8 ⭐⭐
                </div>
                <div>12.7k Rating</div>
              </div>
              <div>
                <span className="text-green-600 mr-2 text-3xl ">
                  ₹{product.discount}
                </span>
                <p className="text-gray-700 text-xl font-semibold mb-4 ">
                  MRP: ₹<strike>{product.price}</strike>
                  <span className="text-red-500 ml-2">
                    ({discountPercent}% OFF)
                  </span>
                </p>
              </div>

              <p className="text-gray-600 text-lg mb-4">{product.details}</p>

              <div className="flex flex-col gap-4">
                <button
                  onClick={addToCart}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg shadow-md transition duration-300"
                >
                  Add to Cart
                </button>

                <button
                  onClick={handleBuynow}
                  className="bg-[#d74545] hover:bg-[#e16767f2] text-white font-bold px-6 py-3 rounded-lg shadow-md transition duration-300 text-center"
                >
                  Buy Now
                </button>
              </div>
            </div>

            {/* More Details */}
            <div className="bg-gray-100 p-6 rounded-md shadow-sm col-span-1 md:col-span-2 w-full">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                More Details
              </h2>
              <p className="text-gray-700">
                {product.information || "No additional details available."}
              </p>
            </div>
          </div>
        )}
      </div>

      <Footer />
      <ToastContainer
        position="top-right"
        hideProgressBar={true}
        autoClose={1500}
        newestOnTop={true}
        closeOnClick
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
      />
    </>
  );
};

export default ProductsDetails;
