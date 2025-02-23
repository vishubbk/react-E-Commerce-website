import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Navbar";
import { ArrowLeft } from "lucide-react";
const UserProfileEdit = () => {
  const [userData, setUserData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    contact: "",
    profilePicture: null,
  });

  const [previewImage, setPreviewImage] = useState(""); // 🔹 Base64 preview ke liye
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Fetch user details when the component loads
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("http://localhost:4000/users/profile", {
          withCredentials: true,
        });

        setUserData({
          firstname: response.data.firstname || "",
          lastname: response.data.lastname || "",
          email: response.data.email || "",
          contact: response.data.contact || "",
          profilePicture: response.data.profilePicture || null,
        });

        // ✅ Agar backend se image mili toh use Base64 me convert karo
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

  // ✅ Handle form input changes
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // ✅ Handle file selection & show preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserData({ ...userData, profilePicture: file });

      // ✅ Create preview in Base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("firstname", userData.firstname);
      formData.append("lastname", userData.lastname);
      formData.append("email", userData.email);
      formData.append("contact", userData.contact);
      if (userData.profilePicture) {
        formData.append("profilePicture", userData.profilePicture);
      }

      const response = await axios.post("http://localhost:4000/users/profile/edit", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        navigate("/users/profile"); // ✅ Redirect after success
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <button className="absolute top-20 left-6 flex items-center text-gray-700" onClick={() => navigate("/users/profile")}>
        <ArrowLeft className="w-5 h-5 mr-2" /> Back
      </button>
      <div className="mt-6 w-full max-w-4xl p-6 absolute top-20 left-1/2 -translate-x-1/2 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Edit Profile</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* 🔹 Profile Picture Preview */}
          <div className="flex flex-col  items-center">
            <img
              src={previewImage || "https://via.placeholder.com/150"}
              alt="Profile Preview"
              className="w-24 h-24 rounded-full border-4 border-gray-300 shadow-lg object-cover"
            />
            <label htmlFor="profilePicture" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer">
              Choose Picture
            </label>
            <input
              type="file"
              id="profilePicture"
              name="profilePicture"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden" // 🔹 Hide default file input
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="firstname" className="text-gray-700 font-medium">First Name</label>
            <input
              type="text"
              name="firstname"
              value={userData.firstname}
              onChange={handleChange}
              className="border p-2 rounded-md"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="lastname" className="text-gray-700 font-medium">Last Name</label>
            <input
              type="text"
              name="lastname"
              value={userData.lastname}
              onChange={handleChange}
              className="border p-2 rounded-md"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-gray-700 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              className="border p-2 rounded-md"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="contact" className="text-gray-700 font-medium">Contact</label>
            <input
              type="text"
              name="contact"
              value={userData.contact}
              onChange={handleChange}
              className="border p-2 rounded-md"
              required
            />
          </div>

          <button
            type="submit"
            className={`p-2 rounded-md text-white ${isLoading ? "bg-gray-500" : "bg-green-600 hover:bg-green-700"}`}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserProfileEdit;
