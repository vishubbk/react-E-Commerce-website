import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Navbar";
import { ArrowLeft, Mail, Phone, User, Edit2 } from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
          withCredentials: true,
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error.response?.data?.message);
        if (error.response?.status === 401 || error.response?.status === 403) {
          navigate("/users/login");
        }
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
                  {user?.firstname} {user?.lastname}
                </h1>
                <p className="text-gray-500 mb-6">{user?.email}</p>
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
              <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                <User className="w-6 h-6 text-blue-500 mr-4" />
                <div>
                  <p className="text-sm text-gray-500">First Name</p>
                  <p className="text-lg font-medium text-gray-800">{user?.firstname || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                <User className="w-6 h-6 text-blue-500 mr-4" />
                <div>
                  <p className="text-sm text-gray-500">Last Name</p>
                  <p className="text-lg font-medium text-gray-800">{user?.lastname || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                <Mail className="w-6 h-6 text-blue-500 mr-4" />
                <div>
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="text-lg font-medium text-gray-800">{user?.email || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                <Phone className="w-6 h-6 text-blue-500 mr-4" />
                <div>
                  <p className="text-sm text-gray-500">Contact Number</p>
                  <p className="text-lg font-medium text-gray-800">{user?.contact || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
