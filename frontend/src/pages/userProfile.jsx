import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/users/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/users/login");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold text-blue-600">Welcome to Your Profile</h1>
        <p className="text-gray-600 mt-2">You are successfully logged in.</p>
        <button onClick={handleLogout} className="bg-blue-600 text-white px-4 py-2 rounded-md mt-4">
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
