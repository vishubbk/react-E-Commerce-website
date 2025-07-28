import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OwnerNavbar from "../../components/OwnerNavbar";
import "../../App.css";

const OwnerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          toast.error("Token missing! Redirecting to login...", { toastId: "token-missing" });
          navigate("/owner/login");
          return;
        }

        setLoading(true);

        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/owner/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        if (!toast.isActive("dashboard-success")) {
          toast.success("Dashboard loaded successfully!", { toastId: "dashboard-success" });
        }

        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);

        if (error.response?.status === 401) {
          toast.warn("Unauthorized! Please log in.", { toastId: "unauthorized" });
          navigate("/owner/login");
        } else {
          toast.error("Failed to load dashboard.", { toastId: "dashboard-error" });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <div style={{
      fontFamily: '"Gidole", sans-serif',
      fontWeight: 400,
      fontStyle: "normal",
    }}>
    <>
      <OwnerNavbar />

      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Owner Dashboard</h1>

        {loading ? (
          <div className="flex justify-center items-center h-60">
            <div className="w-16 h-16 border-4 border-dashed border-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : data ? (
          <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">📊 Dashboard Stats</h2>

            <p className="text-gray-600"><span className="font-semibold text-blue-500">● Owner-Name:</span> {data.owner.firstname} {data.owner.lastname}</p>
            <p className="text-gray-600"><span className="font-semibold text-blue-500">● Owner-Email:</span> {data.owner.email}</p>
            <p className="text-gray-600"><span className="font-semibold text-blue-500">● Total Users:</span> {data.totalUsers}</p>
            <p className="text-gray-600"><span className="font-semibold text-blue-500">● Total Products:</span> {data.totalProducts}</p>

            <h3 className="text-lg font-semibold text-gray-800 mt-6">👥 Users:</h3>
            {data.users?.length > 0 ? (
              <div className="overflow-x-auto mt-4">
                <table className="w-full border-collapse border border-gray-300 shadow-md rounded-lg">
                  <thead>
                    <tr className="bg-blue-500 text-white">
                      <th className="py-2 px-4 border border-gray-300">First Name</th>
                      <th className="py-2 px-4 border border-gray-300">Last Name</th>
                      <th className="py-2 px-4 border border-gray-300">Email</th>
                      <th className="py-2 px-4 border border-gray-300">Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.users.map((user, index) => (
                      <tr key={index} className="bg-gray-100 text-gray-700">
                        <td className="py-2 px-4 border border-gray-300">{user.firstname}</td>
                        <td className="py-2 px-4 border border-gray-300">{user.lastname}</td>
                        <td className="py-2 px-4 border border-gray-300">{user.email}</td>
                        <td className="py-2 px-4 border border-gray-300">{user.contact}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-500">No users available.</p>
            )}

            <h3 className="text-lg font-semibold text-gray-800 mt-6">📦 Products:</h3>
            {data.products?.length > 0 ? (
              <ul className="list-disc list-inside text-gray-600">
                {data.products.map((product, index) => (
                  <li key={index} className="pl-2">
                    {product.name} - <span className="text-sm text-gray-500">₹{product.price}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500">No products available.</p>
            )}
          </div>
        ) : (
          <p className="text-center text-red-500">Failed to load data.</p>
        )}
      </div>
    </></div>
  );
};

export default OwnerDashboard;
