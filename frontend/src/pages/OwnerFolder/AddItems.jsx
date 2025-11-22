import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/OwnerNavbar.jsx";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const colorOptions = [
  { name: "White", value: "#ffffff" },
  { name: "Black", value: "#000000" },
  { name: "Red", value: "#ff0000" },
  { name: "Green", value: "#00ff00" },
  { name: "Blue", value: "#0000ff" },
];

const AddItems = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    discount: "",
    bgcolor: "#ffffff",
    panelcolor: "#f0f0f0",
    textcolor: "#000000",
    details: "",
    information: "",
    category:"",
    images: [],
  });
  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Login first plz... ");
      navigate("/owner/login");
    }
  }, [navigate]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "name"
          ? value.charAt(0).toUpperCase() + value.slice(1)
          : value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Limit to maximum 5 images
    if (formData.images.length + files.length > 5) {
      setError("Maximum 5 images allowed");
      return;
    }

    setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }));

    // Create preview URLs for the images
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...newPreviewUrls]);
    setError(""); // Clear any previous errors
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));

    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(previewImages[index]);
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for minimum 3 images
    if (formData.images.length < 3) {
      setError("Please upload at least 3 images for the product");
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to add this product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, add it!",
    });

    if (!result.isConfirmed) return;

    setLoading(true);
    setError("");
    setSuccess("");

    if (
      Object.values(formData).some((value) => value === "" || value === null)
    ) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      // Append all non-file data
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "images") {
          data.append(key, value);
        }
      });

      // Append each image file
      formData.images.forEach((image, index) => {
        data.append(`images`, image);
      });

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/products/addProduct`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setSuccess(response.data.message);

      // Reset form
      setFormData({
        name: "",
        price: "",
        discount: "",
        bgcolor: "#ffffff",
        panelcolor: "#f0f0f0",
        textcolor: "#000000",
        details: "",
        information: "",
        category:"",
        images: [],
      });

      // Clear preview images and revoke URLs
      previewImages.forEach((url) => URL.revokeObjectURL(url));
      setPreviewImages([]);
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="flex justify-center items-center bg-gray-100 min-h-screen py-6 ">
        <div className="max-w-3xl w-full bg-white shadow-md rounded-lg p-6 overflow-y-auto mt-12 h-[84vh]">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">
            Add New Product
          </h2>

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
            <label className="font-semibold text-gray-700">
              Discount Amount:
            </label>
            <input
              type="number"
              name="discount"
              placeholder="Enter Discount Amount"
              value={formData.discount}
              onChange={handleChange}
              className="border p-2 rounded-md"
            />

            {/* Background Color */}
            <label className="font-semibold text-gray-700">
              Background Color:
            </label>
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
              <input
                type="color"
                name="bgcolor"
                value={formData.bgcolor}
                onChange={handleChange}
              />
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
              <input
                type="color"
                name="panelcolor"
                value={formData.panelcolor}
                onChange={handleChange}
              />
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
              <input
                type="color"
                name="textcolor"
                value={formData.textcolor}
                onChange={handleChange}
              />
            </div>

            {/* details */}
            <label className="font-semibold text-gray-700">
              Product details:
            </label>
            <textarea
              name="details"
              placeholder="Enter Product details"
              value={formData.details}
              onChange={handleChange}
              className="border p-2 rounded-md h-20"
            />

            {/* Product Information */}
            <label className="font-semibold text-gray-700">
              Product Information:
            </label>
           <textarea
  name="information"
  placeholder="Enter Product Information"
  value={formData.information}
  onChange={handleChange}
  className="border p-2 rounded-md h-20"
/>

            {/* category Information */}
            <label className="font-semibold text-gray-700">
              category Information:
            </label>
           <textarea
  name="category"
  placeholder="Enter category Information"
  value={formData.category}
  onChange={handleChange}
  className="border p-2 rounded-md h-20"
/>



            {/* Image Upload */}
            <label className="font-semibold text-gray-700">
              Upload Product Images:
              <span className="text-sm text-gray-500 ml-2">
                (Minimum 3, Maximum 5 images required)
              </span>
            </label>
            <div className="flex flex-col gap-2">
              <input
                type="file"
                accept="image/*"
                name="images"
                onChange={handleImageChange}
                multiple
                className="border p-2 rounded-md"
              />
              <p className="text-sm text-blue-600">
                Selected: {formData.images.length} of 5 images
                {formData.images.length < 3 && (
                  <span className="text-red-500">
                    {" "}
                    (Need at least {3 - formData.images.length} more)
                  </span>
                )}
              </p>
            </div>

            {/* Image Previews */}
            {previewImages.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                {previewImages.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className={`py-2 px-4 rounded-md text-white ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
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
