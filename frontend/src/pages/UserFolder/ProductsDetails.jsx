import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ProductsDetails = () => {
  const [product, setProduct] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-24 pt-20 flex justify-center">
        {!product ? (
          <div className="w-full max-w-4xl p-6 bg-white shadow-lg rounded-lg animate-pulse">
            <div className="h-64 bg-gray-300 rounded-md mb-4"></div>
            <div className="h-6 bg-gray-300 w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-300 w-1/2 mb-3"></div>
            <div className="h-4 bg-gray-300 w-1/3 mb-3"></div>
            <div className="h-10 bg-gray-300 w-full rounded-md"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white shadow-xl rounded-lg p-6">
            <div className="relative flex justify-center">
              <img
                src={product.image?.url || "https://via.placeholder.com/300"}
                alt={product.name}
                className="w-full h-96 object-fill rounded-md shadow-md"
                loading="lazy"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl font-extrabold mb-4 text-gray-800">{product.name}</h1>
              <p className="text-gray-600 text-lg mb-4">{product.description}</p>
              <p className="text-gray-700 text-xl font-semibold mb-4">Price: <span className="text-green-600">₹{product.price}</span></p>
              <p className="text-gray-600 mb-6">Details: {product.Details}</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg shadow-md transition duration-300">
                Add to Cart
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ProductsDetails;
