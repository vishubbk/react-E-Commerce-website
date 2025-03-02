/* eslint-disable no-undef */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Navbar";
import { ArrowLeft } from "lucide-react";

const UserProfileEdit = () => {
  const [userData, setUserData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    contact: "",
    profilePicture: null,
  });

  const [previewImage, setPreviewImage] = useState("");
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
    <>
     <Header className="absolute" />
    <div className="flex items-center justify-center m-auto  bg-gray-50 relative">


      {/* Back Button with better positioning */}
      <button
        className="fixed top-20 left-4 md:left-8 flex items-center text-gray-700 hover:text-gray-900 transition-colors"
        onClick={() => navigate("/users/profile")}
      >
        <ArrowLeft className="w-5 h-5 mr-1" /> Back
      </button>

      {/* Main Container */}
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <img
                  src={previewImage || "https://via.placeholder.com/150"}
                  alt="Profile Preview"
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover transition-transform group-hover:scale-105"
                />
                <label
                  htmlFor="profilePicture"
                  className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 p-2 rounded-full text-white cursor-pointer shadow-lg transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
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
            </div>

            {/* Form Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* First Name */}
              <div className="space-y-2">
                <label htmlFor="firstname" className="text-gray-700 font-medium block">First Name</label>
                <input
                  type="text"
                  name="firstname"
                  value={userData.firstname}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label htmlFor="lastname" className="text-gray-700 font-medium block">Last Name</label>
                <input
                  type="text"
                  name="lastname"
                  value={userData.lastname}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-gray-700 font-medium block">Email</label>
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              {/* Contact */}
              <div className="space-y-2">
                <label htmlFor="contact" className="text-gray-700 font-medium block">Contact</label>
                <input
                  type="text"
                  name="contact"
                  value={userData.contact}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className={`px-6 py-2 rounded-lg text-white font-medium transition-all
                  ${isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 active:transform active:scale-95"
                  }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div></>
  );
};

export default UserProfileEdit;
