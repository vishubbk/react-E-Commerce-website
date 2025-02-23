import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
          withCredentials: true, // ✅ Automatically sends cookies
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

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/users/logout`, {}, { withCredentials: true });
      navigate("/users/login");
    } catch (error) {
      console.error("Logout error:", error.response?.data?.message);
    }
  };

  return (
    <div className="mt-6 w-full max-w-4xl p-6 bg-white shadow-md rounded-lg">
      <div className="flex items-center space-x-4">
        <img
          src={user?.profileImage || "https://via.placeholder.com/150"}
          alt="Profile"
          className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
        />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{user?.firstname} {user?.lastname}</h2>
          <p className="text-gray-600">{user?.email}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="p-3 border rounded bg-gray-50">
          <label className="block text-gray-600">First Name</label>
          <p className="text-gray-700">{user?.firstname || "N/A"}</p>
        </div>

        <div className="p-3 border rounded bg-gray-50">
          <label className="block text-gray-600">Last Name</label>
          <p className="text-gray-700">{user?.lastname || "N/A"}</p>
        </div>

        <div className="p-3 border rounded bg-gray-50">
          <label className="block text-gray-600">Email</label>
          <p className="text-gray-700">{user?.email || "N/A"}</p>
        </div>

        <div className="p-3 border rounded bg-gray-50">
          <label className="block text-gray-600">Contact</label>
          <p className="text-gray-700">{user?.contact || "N/A"}</p>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600">
        Logout
      </button>
    </div>
  );
};

export default Profile;
