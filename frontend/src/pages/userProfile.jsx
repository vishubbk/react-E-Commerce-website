import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch User Profile
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Unauthorized! Redirecting to login...");
        navigate("/users/login");
        return;
      }

      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error(error.response?.data?.message || "Failed to load profile!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <div className="profile-container">
      <h1>User Profile</h1>
      {loading ? (
        <p>Loading profile...</p>
      ) : userData ? (
        <div className="profile-card">
          <p><strong>Name:</strong> {userData.firstname} {userData.lastname}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Contact:</strong> {userData.contact}</p>
        </div>
      ) : (
        <p>No profile data found</p>
      )}
      <button onClick={() => {
        localStorage.removeItem("token");
        navigate("/users/login");
      }}>
        Logout
      </button>
      <ToastContainer />
    </div>
  );
};

export default UserProfile;
