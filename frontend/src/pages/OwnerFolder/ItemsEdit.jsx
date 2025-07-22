import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/OwnerNavbar.jsx";

const colorOptions = [
  { name: "White", value: "#ffffff" },
  { name: "Black", value: "#000000" },
  { name: "Red", value: "#ff0000" },
  { name: "Green", value: "#00ff00" },
  { name: "Blue", value: "#0000ff" },
];

const ItemsEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    discount: "",
    bgcolor: "#ffffff",
    panelcolor: "#f0f0f0",
    textcolor: "#000000",
    details: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      return navigate("/owner/login");
    }

    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/owner/EditProduct/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const product = res.data;
        setFormData({
          name: product.name || "",
          price: product.price || "",
          discount: product.discount || "",
          bgcolor: product.bgcolor || "#ffffff",
          panelcolor: product.panelcolor || "#f0f0f0",
          textcolor: product.textcolor || "#000000",
          details: product.details || "",
          information: product.information || "",
          image: product.image || null,
        });
      } catch (err) {
        console.error("Error fetching product:", err.message);
        setError("Failed to load product");
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "name" ? value.charAt(0).toUpperCase() + value.slice(1) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/owner/EditProduct/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setSuccess(res.data.message);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="flex justify-center items-center bg-gray-100 min-h-screen py-6">
        <div className="max-w-3xl w-full bg-white shadow-md rounded-lg p-6 overflow-y-auto mt-12 h-[84vh]">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">Edit Product</h2>

          {error && <p className="text-red-500 mb-2 text-center">{error}</p>}
          {success && <p className="text-green-500 mb-2 text-center">{success}</p>}

          <form onSubmit={handleSubmit} className="grid gap-3">
            {/* Product Name */}
            <label className="font-semibold text-gray-700">Product Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border p-2 rounded-md"
            />

            {/* Price */}
            <label className="font-semibold text-gray-700">Price:</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="border p-2 rounded-md"
            />

            {/* Discount */}
            <label className="font-semibold text-gray-700">Discount:</label>
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              className="border p-2 rounded-md"
            />

            {/* Background Color */}
            <label className="font-semibold text-gray-700">Background Color:</label>
            <div className="flex items-center gap-2">
              <select
                name="bgcolor"
                value={formData.bgcolor}
                onChange={handleChange}
                className="border p-2 rounded-md w-full"
              >
                {colorOptions.map((color) => (
                  <option key={color.value} value={color.value}>
                    {color.name}
                  </option>
                ))}
              </select>
              <input type="color" name="bgcolor" value={formData.bgcolor} onChange={handleChange} />
            </div>

            {/* Panel Color */}
            <label className="font-semibold text-gray-700">Panel Color:</label>
            <div className="flex items-center gap-2">
              <select
                name="panelcolor"
                value={formData.panelcolor}
                onChange={handleChange}
                className="border p-2 rounded-md w-full"
              >
                {colorOptions.map((color) => (
                  <option key={color.value} value={color.value}>
                    {color.name}
                  </option>
                ))}
              </select>
              <input type="color" name="panelcolor" value={formData.panelcolor} onChange={handleChange} />
            </div>

            {/* Text Color */}
            <label className="font-semibold text-gray-700">Text Color:</label>
            <div className="flex items-center gap-2">
              <select
                name="textcolor"
                value={formData.textcolor}
                onChange={handleChange}
                className="border p-2 rounded-md w-full"
              >
                {colorOptions.map((color) => (
                  <option key={color.value} value={color.value}>
                    {color.name}
                  </option>
                ))}
              </select>
              <input type="color" name="textcolor" value={formData.textcolor} onChange={handleChange} />
            </div>

            {/* Details */}
            <label className="font-semibold text-gray-700">Product Details:</label>
            <textarea
              name="details"
              value={formData.details}
              onChange={handleChange}
              className="border p-2 rounded-md h-20 max-h-25 min-h-12"
            />

            {/* information */}
            <label className="font-semibold text-gray-700">Product information:</label>
            <textarea
              name="information"
              value={formData.information}
              onChange={handleChange}
              className="border p-2 rounded-md h-20 max-h-25 min-h-12"
            />

            {/* Image Note */}
            <label className="font-semibold text-red-500 mt-3 text-center">
              ⚠️ Image editing is disabled for existing products.
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              className={`py-2 px-4 rounded-md text-white ${
                loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
              }`}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Product"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ItemsEdit;
