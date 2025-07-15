import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/OwnerNavbar.jsx";

const AllOrdersShow = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/owner/orders`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
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
  }, [navigate]);

  // Confirm or cancel order
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/owner/orders/${orderId}/status`,
        { status: newStatus },{
        headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,}
      );

      // Update order status locally
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Failed to update order status", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
          All Orders
        </h1>

        {loading ? (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
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
                  <th className="border px-4 py-3">Actions</th>
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
                          order.status === "pending"
                            ? "bg-red-500 text-white"
                            : order.status === "completed"
                            ? "bg-green-500 text-white"
                            : order.status === "cancelled"
                            ? "bg-gray-500 text-white"
                            : "bg-blue-500 text-white"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="border px-4 py-3 flex flex-col gap-2">
                      {order.status !== "completed" && (
                        <button
                          onClick={() => updateOrderStatus(order._id, "completed")}
                          className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                        >
                          Complete Order
                        </button>
                      )}
                      {order.status !== "cancelled" && (
                        <button
                          onClick={() => updateOrderStatus(order._id, "cancelled")}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                        >
                          Cancel Order
                        </button>
                      )}
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
