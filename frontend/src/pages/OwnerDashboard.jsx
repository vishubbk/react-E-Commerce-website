import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const OwnerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/owner/login");

      try {
        const response = await axios.get("http://localhost:4000/owner/dashboard", {
          headers: { Authorization: token },
        });
        setDashboardData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      }
    };

    fetchDashboard();
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="bg-gray-100  min-h-screen">
      <Navbar className="relative" />
      <div className="container absolute top-0 left-0 right-0  mt-7 mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-center mb-6">Owner Dashboard</h1>

        {dashboardData ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-2">Total Products</h2>
              <p className="text-2xl text-blue-600">{dashboardData.totalProducts}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-2">Total Orders</h2>
              <p className="text-2xl text-green-600">{dashboardData.totalOrders}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-2">Total Users</h2>
              <p className="text-2xl text-red-600">{dashboardData.totalUsers}</p>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600">Loading...</p>
        )}

        <div className="flex justify-center mt-6">
          <button
            onClick={logout}
            className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition duration-300"
          >
            Logout
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OwnerDashboard;
