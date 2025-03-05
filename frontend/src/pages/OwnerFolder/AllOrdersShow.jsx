import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/OwnerNavbar";

const AllOrdersShow = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/owner/orders`,
          { withCredentials: true }
        );
        setOrders(response.data.orders);
      } catch (error) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          navigate("/owner/login");
        }
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
          All Orders
        </h1>

        {loading ? (
          <p className="text-center text-gray-600">Loading orders...</p>
        ) : orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 shadow-lg rounded-lg overflow-hidden">
              <thead className="bg-blue-600 text-white">
                <tr className="text-left">
                  <th className="border px-4 py-3">Customer</th>
                  <th className="border px-4 py-3">Email</th>
                  <th className="border px-4 py-3">Mobile</th>
                  <th className="border px-4 py-3">Order-Name</th>
                  <th className="border px-4 py-3">Date</th>
                  <th className="border px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-blue-50 transition duration-200"
                  >
                    <td className="border px-4 py-3">{order.userName}</td>
                    <td className="border px-4 py-3">{order.email}</td>
                    <td className="border px-4 py-3">+91{order.contact}</td>
                    <td className="border px-4 py-3">{order.orderName}</td>
                    <td className="border px-4 py-3">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </td>
                    <td className="border px-4 py-3 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          order.orderStatus === "pending"
                            ? "bg-yellow-500 text-white"
                            : order.orderStatus === "completed"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-600">No orders available.</p>
        )}
      </div>
    </>
  );
};

export default AllOrdersShow;
