/* eslint-disable no-undef */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Navbar.jsx";
import { ArrowLeft } from "lucide-react";
import "../../App.css";

const UserProfileEdit = () => {
  const [userData, setUserData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    contact: "",
    profilePicture: null,
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
    },
  });

  const [previewImage, setPreviewImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        setUserData({
          firstname: response.data.firstname || "",
          lastname: response.data.lastname || "",
          email: response.data.email || "",
          contact: response.data.contact || "",
          profilePicture: response.data.profilePicture || null,
          address: response.data.address || {
            street: "",
            city: "",
            state: "",
            country: "",
          },
        });

        if (response.data.profilePicture?.data) {
          const base64Image = `data:${response.data.profilePicture.contentType};base64,${Buffer.from(
            response.data.profilePicture.data
          ).toString("base64")}`;
          setPreviewImage(base64Image);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["street", "city", "state", "country"].includes(name)) {
      setUserData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value,
        },
      }));
    } else {
      setUserData({ ...userData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // ✅ File size validation
      if (file.size > 10 * 1024 * 1024) {
        alert("File size should not exceed 10MB.");
        return;
      }

      setUserData({ ...userData, profilePicture: file });

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("firstname", userData.firstname);
      formData.append("lastname", userData.lastname);
      formData.append("email", userData.email);
      formData.append("contact", userData.contact);
      formData.append("address", JSON.stringify(userData.address));

      if (userData.profilePicture) {
        formData.append("profilePicture", userData.profilePicture);
      }

      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/profile/edit`, formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      if (response.status === 200) {
        navigate("/users/profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      fontFamily: '"Gidole", sans-serif',
      fontWeight: 400,
      fontStyle: "normal",
    }}>
    <>
    <div className="absolute top-0">
       <Header />
    </div>
     
      <div className="flex items-center justify-center min-h-screen mt-15 bg-gray-100 px-4">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl">
          {/* Back Button */}
          <button
            className="flex items-center text-gray-700 hover:text-gray-900 transition-colors mb-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5 mr-1" /> Back
          </button>

          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Edit Profile</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Profile Picture Upload */}
            <div className="flex flex-col items-center">
              <label htmlFor="profilePicture" className="cursor-pointer">
                <img
                  src={previewImage || "https://cdn-icons-png.flaticon.com/128/9930/9930370.png"}
                  alt="Profile Preview"
                  className="w-24 h-24 rounded-full border-2 border-gray-300 shadow-md object-cover"
                />
              </label>
              <input
                type="file"
                id="profilePicture"
                name="profilePicture"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Input Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="firstname"
                value={userData.firstname}
                onChange={handleChange}
                placeholder="First Name"
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                type="text"
                name="lastname"
                value={userData.lastname}
                onChange={handleChange}
                placeholder="Last Name"
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                type="text"
                name="contact"
                value={userData.contact}
                onChange={handleChange}
                placeholder="Contact"
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                type="text"
                name="street"
                value={userData.address.street}
                onChange={handleChange}
                placeholder="Street"
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                type="text"
                name="city"
                value={userData.address.city}
                onChange={handleChange}
                placeholder="City"
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                type="text"
                name="state"
                value={userData.address.state}
                onChange={handleChange}
                placeholder="State"
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                type="text"
                name="country"
                value={userData.address.country}
                onChange={handleChange}
                placeholder="Country"
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </></div>
  );
};

export default UserProfileEdit;
