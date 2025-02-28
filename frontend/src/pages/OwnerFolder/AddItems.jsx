import { useState } from "react";
import axios from "axios";
import Navbar from "../../components/OwnerNavbar";

const colorOptions = [
  { name: "White", value: "#ffffff" },
  { name: "Black", value: "#000000" },
  { name: "Red", value: "#ff0000" },
  { name: "Green", value: "#00ff00" },
  { name: "Blue", value: "#0000ff" },
];

const AddItems = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    discount: "",
    bgcolor: "#ffffff",
    panelcolor: "#f0f0f0",
    textcolor: "#000000",
    Details: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "name" ? value.charAt(0).toUpperCase() + value.slice(1) : value,
    }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (Object.values(formData).some((value) => value === "" || value === null)) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => data.append(key, value));

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/products/addProduct`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setSuccess(response.data.message);
      setFormData({
        name: "",
        price: "",
        discount: "",
        bgcolor: "#ffffff",
        panelcolor: "#f0f0f0",
        textcolor: "#000000",
        Details: "",
        image: null,
      });
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="flex justify-center items-center bg-gray-100 min-h-screen py-6">
        <div className="max-w-3xl w-full bg-white shadow-md rounded-lg p-6 overflow-y-auto h-[90vh]">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">Add New Product</h2>

          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}

          <form onSubmit={handleSubmit} className="grid gap-3">
            {/* Product Name */}
            <label className="font-semibold text-gray-700">Product Name:</label>
            <input
              type="text"
              name="name"
              placeholder="Enter Product Name"
              value={formData.name}
              onChange={handleChange}
              className="border p-2 rounded-md"
            />

            {/* Price */}
            <label className="font-semibold text-gray-700">Price:</label>
            <input
              type="number"
              name="price"
              placeholder="Enter Price"
              value={formData.price}
              onChange={handleChange}
              className="border p-2 rounded-md"
            />

            {/* Discount */}
            <label className="font-semibold text-gray-700">Discount (%):</label>
            <input
              type="number"
              name="discount"
              placeholder="Enter Discount (%)"
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
              name="Details"
              placeholder="Enter Product Details"
              value={formData.Details}
              onChange={handleChange}
              className="border p-2 rounded-md h-20"
            />

            {/* Image Upload */}
            <label className="font-semibold text-gray-700">Upload Product Image:</label>
            <input
              type="file"
              accept="image/*"
              name="image"
              onChange={handleImageChange}
              className="border p-2 rounded-md"
            />

            {/* Submit Button */}
            <button
              type="submit"
              className={`py-2 px-4 rounded-md text-white ${
                loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
              }`}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Product"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddItems;
