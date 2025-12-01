// ...existing code...
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../UserFolder/modern.css";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ShoppingBag, Star, Heart } from "lucide-react";
import { motion } from "framer-motion";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";


const ProductsDetails = () => {
  const [loader, setLoader] = useState(false);
  const [product, setProduct] = useState(null);
  const [item, setItem] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();

  // Ensure top scroll on mount / product change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  useEffect(() => {
    if (product?.images?.length > 0) setSelectedImage(0);
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

  useEffect(() => {
    const fetchSuggestedProducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/products/suggest/${id}`
        );
        setItem(response.data);
      } catch (error) {
        console.error("❌ Error fetching suggested products:", error);
      }
    };
    fetchSuggestedProducts();
  }, [id]);

  const addToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        Toastify({
          text: `You need to login first.`,
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
        text: `You need to login first.`,
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

  const fmt = (n) =>
    typeof n === "number" ? n.toLocaleString("en-IN") : n || "-";

  return (
    <>
    <div className="absolute top-0">

      <Navbar />
    </div>

      <div className="container relative top-13 mx-auto px-4 py-8 " >
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-4">
          <Link to="/" className="hover:underline">
            Home
          </Link>{" "}
          /{" "}
          <Link to="/users/products" className="hover:underline">
            Products
          </Link>{" "}
          / <span className="font-medium">{product?.name || "Product"}</span>
        </div>

        {loader ? (
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="text-blue-600 mb-4"
            >
              <ShoppingBag size={72} />
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 ">
            {/* Left: Thumbnails (vertical) + Main Image */}
            <div className="lg:col-span-5 bg-white rounded-lg p-4 shadow-sm">
              <div className="flex gap-4">
                {/* Vertical thumbnails for large screens */}
                <div className="hidden lg:flex flex-col gap-3 w-20 overflow-auto">
                  {(product.images?.length ? product.images : [product.image]).map(
                    (img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`rounded-md overflow-hidden p-0 border ${
                          selectedImage === idx
                            ? "border-blue-500 shadow-md scale-105"
                            : "border-gray-200"
                        }`}
                      >
                        <img
                          src={img?.url || "https://via.placeholder.com/150"}
                          alt={`${product.name} ${idx}`}
                          className="w-20 h-20 object-cover"
                        />
                      </button>
                    )
                  )}
                </div>

                <div className="flex-1">
                  <div className="bg-white flex items-center justify-center p-6 rounded-md border border-gray-100 shadow-sm">
                    <img
                      src={
                        product.images?.[selectedImage]?.url ||
                        product.image?.url ||
                        "https://via.placeholder.com/500x500?text=No+Image"
                      }
                      alt={product.name}
                      className="max-h-[420px] w-full object-contain"
                      loading="lazy"
                    />
                  </div>

                  {/* Mobile thumbnails */}
                  {product.images && product.images.length > 1 && (
                    <div className="mt-3 flex gap-2 overflow-x-auto lg:hidden">
                      {product.images.map((img, index) => (
                        <img
                          key={index}
                          src={img.url}
                          alt={`${product.name} thumb ${index + 1}`}
                          onClick={() => setSelectedImage(index)}
                          className={`w-20 h-20 object-cover rounded-md cursor-pointer border ${
                            selectedImage === index
                              ? "border-blue-500 shadow-lg"
                              : "border-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Middle: Product info */}
            <div className="lg:col-span-4 bg-white rounded-lg p-6 shadow-sm">
              <h1 className="text-2xl font-semibold text-gray-800 mb-2">
                {product.name}
              </h1>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1 bg-green-600 text-white px-2 py-1 rounded">
                  <Star size={14} /> <span className="text-sm ml-1">3.8</span>
                </div>
                <span className="text-sm text-gray-600">12.7k Ratings</span>

              </div>

              <div className="mb-4">
                <div className="flex items-baseline gap-4">
                  <div className="text-3xl font-bold text-gray-900">
                    ₹{fmt(product.discount)}
                  </div>
                  <div className="text-sm text-gray-500 line-through">
                    ₹{fmt(product.price)}
                  </div>
                  <div className="text-sm text-green-600 font-semibold">
                    {discountPercent}% OFF
                  </div>
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  Inclusive of all taxes
                </div>
              </div>

              <p className="text-gray-700 mb-4">{product.details}</p>

              <div className="space-y-2">
                <div className="text-sm text-gray-600">
                  Seller:{" "}
                  <span className="text-blue-600 font-medium">Best Seller</span>
                </div>
                <div className="text-sm text-gray-600">
                  Delivery: <span className="font-medium">Tomorrow</span>
                </div>
                <div className="text-sm text-gray-600">
                  Returns: <span className="font-medium">7 Days Return</span>
                </div>
              </div>
            </div>

            {/* Right: Sticky purchase actions (like Amazon/Flipkart) */}
            <div className="lg:col-span-3">
              <div className="sticky top-28 bg-white border rounded-lg p-4 shadow-md">
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-sm text-gray-500">Price</div>
                    <div className="text-2xl font-bold text-gray-900">
                      ₹{fmt(product.discount)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500 line-through">
                      ₹{fmt(product.price)}
                    </div>
                    <div className="text-sm text-green-600 font-semibold">
                      {discountPercent}% off
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    onClick={addToCart}
                    className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={handleBuynow}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
                  >
                    Buy Now
                  </button>
                </div>

                <div className="mt-4 text-sm text-gray-600">
                  <div className="mb-2">
                    <span className="font-medium">Offers:</span>{" "}
                    <span className="text-gray-700">
                      Extra 5% off with bank card
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="font-medium">EMI:</span>{" "}
                    <span className="text-gray-700">No-cost EMI available</span>
                  </div>

                </div>
              </div>

              {/* Recommended compact list for small screens under sticky */}
              <div className="mt-6 bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-3">Recommended</h3>
                {item?.slice(0, 3).map((it) => (
                  <div key={it._id} className="flex items-center gap-3 mb-3">
                    <img
                      src={it?.images?.[0]?.url}
                      alt={it.name}
                      className="w-14 h-14 object-contain bg-gray-50 p-1 rounded"
                    />
                    <div className="flex-1 w-14">
                      <div className="text-sm font-medium truncate">{it.name}</div>
                      <div className="text-sm text-blue-600">₹{fmt(it.discount)}</div>
                    </div>
                    <button
                      onClick={() => navigate(`/products/${it._id}`)}
                      className="text-sm text-gray-700 hover:underline"
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Full width: More details / description */}
            <div className="lg:col-span-12 bg-white p-6 rounded-lg shadow-sm mt-4">
              <h2 className="text-xl font-semibold mb-2">Product Description</h2>
              <p className="text-gray-700">
                {product.information || "No additional details available."}
              </p>
            </div>

            {/* Recommended grid */}
            <div className="lg:col-span-12 bg-white p-6 rounded-lg mt-4">
              <h2 className="text-xl font-semibold mb-4">You may also like</h2>
              {item?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {item.map((items) => (
                    <div
                      key={items._id}
                      className="border rounded-lg p-3 hover:shadow-md transition"
                    >
                      <div className="h-40 flex items-center justify-center bg-white">
                        <img
                          src={items?.images?.[0]?.url}
                          alt={items.name}
                          className="object-contain max-h-full"
                        />
                      </div>
                      <div className="mt-3">
                        <div className="font-medium text-sm truncate">{items.name}</div>
                        <div className="text-blue-600 font-bold mt-1">₹{fmt(items.discount)}</div>
                        <button
                          onClick={() => navigate(`/products/${items._id}`)}
                          className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No recommended products.</p>
              )}
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
// ...existing code...
