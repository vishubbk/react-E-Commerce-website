import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Navbar";
import { ArrowLeft, Mail, Phone, User, Edit2 } from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/users/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        console.log("Profile Data:", response.data);
        setUser(response.data || {});
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);

        if (error.response) {
          console.error("Error Response:", error.response.data);
          if (error.response.status === 401) {
            alert("Session expired. Please login again.");
            navigate("/users/login");
          } else {
            alert(error.response.data.message || "Something went wrong.");
          }
        } else if (error.request) {
          console.error("Error Request:", error.request);
          alert("No response from server. Please try again later.");
        } else {
          console.error("Error:", error.message);
          alert("An unexpected error occurred.");
        }

        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <button
        className="fixed top-20 left-6 flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="w-5 h-5 mr-2" /> Back
      </button>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <SkeletonLoader />
          ) : (
            <>
              {/* Profile Header */}
              <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                  <div className="relative group">
                    <div className="w-40 h-40 rounded-full overflow-hidden ring-4 ring-blue-100 shadow-lg">
                      <img
                        src={user?.profilePicture || "https://via.placeholder.com/150"}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                      {user?.firstname || "N/A"} {user?.lastname || ""}
                    </h1>
                    <p className="text-gray-500 mb-6">{user?.email || "No email provided"}</p>
                    <button
                      onClick={() => navigate("/users/profile/edit")}
                      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg
                        hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ProfileDetail icon={User} label="First Name" value={user?.firstname} />
                  <ProfileDetail icon={User} label="Last Name" value={user?.lastname} />
                  <ProfileDetail icon={Mail} label="Email Address" value={user?.email} />
                  <ProfileDetail icon={Phone} label="Contact Number" value={user?.contact} />

                  <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                    <Phone className="w-6 h-6 text-blue-500 mr-4" />
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="text-lg font-medium text-gray-800">
                        {typeof user?.address === "string"
                          ? user.address
                          : user?.address?.city
                          ? `${user.address.city}, ${user.address.state || ""}`
                          : "No address provided"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ✅ Profile Detail Card
const ProfileDetail = ({ icon: Icon, label, value }) => (
  <div className="flex items-center p-4 bg-gray-50 rounded-xl">
    <Icon className="w-6 h-6 text-blue-500 mr-4" />
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-lg font-medium text-gray-800">{value || "N/A"}</p>
    </div>
  </div>
);

// ✅ Skeleton Loader (Content Only, Header Always Visible)
const SkeletonLoader = () => (
  <div className="animate-pulse space-y-6">
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="w-40 h-40 bg-gray-300 rounded-full"></div>
        <div className="flex-1 space-y-4">
          <div className="w-3/4 h-6 bg-gray-300 rounded"></div>
          <div className="w-1/2 h-6 bg-gray-300 rounded"></div>
          <div className="w-1/4 h-10 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="space-y-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
            <div className="flex-1 h-6 bg-gray-300 rounded"></div>
          </div>
        ))}
        <div className="flex items-center space-x-4 mt-4">
          <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
          <div className="flex-1 h-6 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  </div>
);

export default Profile;
