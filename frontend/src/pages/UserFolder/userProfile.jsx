import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Navbar";
import { ArrowLeft } from "lucide-react";

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
    <>
      <Header />

      {/* 🔹 Back Button with Icon */}
      <button className="absolute top-20 left-6 flex items-center text-gray-700" onClick={() => navigate("/")}>
        <ArrowLeft className="w-5 h-5 mr-2" /> Back
      </button>

      <div className="min-h-screen bg-white flex justify-center items-center p-4">
        <div className="max-w-3xl w-full bg-gray-100 shadow-lg rounded-lg p-8 relative">
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-300 shadow-md">
              <img
                src={user?.profilePicture || "https://via.placeholder.com/150"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mt-4">{user?.firstname} {user?.lastname}</h2>
            <p className="text-gray-600 text-sm">{user?.email}</p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="p-4 bg-white border rounded-lg shadow-sm">
              <span className="text-gray-600">First Name</span>
              <p className="text-gray-800 font-semibold">{user?.firstname || "N/A"}</p>
            </div>
            <div className="p-4 bg-white border rounded-lg shadow-sm">
              <span className="text-gray-600">Last Name</span>
              <p className="text-gray-800 font-semibold">{user?.lastname || "N/A"}</p>
            </div>
            <div className="p-4 bg-white border rounded-lg shadow-sm">
              <span className="text-gray-600">Email</span>
              <p className="text-gray-800 font-semibold">{user?.email || "N/A"}</p>
            </div>
            <div className="p-4 bg-white border rounded-lg shadow-sm">
              <span className="text-gray-600">Contact</span>
              <p className="text-gray-800 font-semibold">{user?.contact || "N/A"}</p>
            </div>
          </div>

          <div className="flex justify-center mt-6 gap-4">

            <button
              onClick={() => navigate("/users/profile/edit")}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
