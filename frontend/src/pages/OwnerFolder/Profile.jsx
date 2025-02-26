/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import OwnerNavbar from "../../components/OwnerNavbar";

const Profile = () => {
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOwnerProfile = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/owner/dashboard`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setOwner(response.data.owner);
      } catch (err) {
       console.error("Error fetching owner profile:", err.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <OwnerNavbar />
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center p-6 bg-red-50 rounded-lg">
            <p className="text-red-500">{error}</p>
          </div>
        ) : owner && (
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600"></div>
              <div className="relative px-6 pb-6">
                <div className="flex flex-col md:flex-row items-center md:items-end -mt-20 md:-mt-16 space-y-4 md:space-y-0 md:space-x-6">
                  <img
                    src={owner.profilePicture || "https://via.placeholder.com/150"}
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                  />
                  <div className="text-center md:text-left">
                    <h1 className="text-3xl font-bold text-gray-800">{owner.firstname} {owner.lastname}</h1>
                    <p className="text-gray-600 mt-1">{owner.email}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold text-gray-800 text-center">Total Sales</h3>
                <p className="text-3xl font-bold text-blue-600 mt-2 text-center">9999+</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold text-gray-800 text-center">Products</h3>
                <p className="text-3xl font-bold text-blue-600 mt-2 text-center">4890</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold text-gray-800 text-center">Orders</h3>
                <p className="text-3xl font-bold text-blue-600 mt-2 text-center">999+</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <button onClick={() => navigate("/owner/new-product")} className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-colors w-full">
                <span>Add New Product</span>
              </button>
              <button onClick={() => navigate("/owner/editProfile")} className="flex items-center justify-center space-x-2 bg-pink-900 text-white px-6 py-3 rounded-lg shadow-md hover:bg-pink-800 transition-colors w-full">
                <span>Edit</span>
              </button>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
