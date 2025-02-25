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
      <div className="container mx-auto px-4 py-24 pt-20">
        {product && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <p className="text-gray-600 mb-4">Price: ${product.price}</p>
              <p className="text-gray-600 mb-4">Quantity: {product.quantity}</p>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Add to Cart</button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}

export default ProductsDetails
