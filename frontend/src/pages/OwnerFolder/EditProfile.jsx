import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    bio: "", // Added bio field
    profileImage: null,
    imagePreview: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setFormData((prevState) => ({
          ...prevState,
          profileImage: file,
          imagePreview: reader.result,
        }));
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("firstName", formData.firstName);
      formDataToSend.append("lastName", formData.lastName);
      formDataToSend.append("phoneNumber", formData.phoneNumber);
      formDataToSend.append("bio", formData.bio); // Send bio
      if (formData.profileImage) {
        formDataToSend.append("profileImage", formData.profileImage);
      }

      const response = await axios.post(
        "http://localhost:4000/owner/editprofile",
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        navigate("/users/profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Edit Profile</h1>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex justify-center">
          <label className="cursor-pointer">
            <input type="file" className="hidden" onChange={handleImageChange} />
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300 flex items-center justify-center">
              {formData.imagePreview ? (
                <img src={formData.imagePreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <img src="https://via.placeholder.com/150" alt="Default Profile" className="w-full h-full object-cover" />
              )}
            </div>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <textarea
          name="bio"
          placeholder="Bio (optional)"
          value={formData.bio}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
