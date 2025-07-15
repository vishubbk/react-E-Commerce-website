import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/OwnerNavbar.jsx";
import Swal from "sweetalert2";
import { X, Check } from "lucide-react";

const AllOrdersShow = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all orders
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

  // Update status
  const updateOrderStatus = async (orderId, newStatus) => {
    const result = await Swal.fire({
      title: `Confirm to ${newStatus} this order?`,
      icon: "question",
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: "No",
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/owner/orders/update-status`,
        { orderId, status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setOrders((prev) =>
        prev.map((order) =>
          order.orderId === orderId ? { ...order, status: newStatus } : order
        )
      );

      Swal.fire("Success", `Order marked as ${newStatus}`, "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Update failed", "error");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-6">All Orders</h1>

        {loading ? (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
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
                    className="border-b hover:bg-black-50 transition duration-200"
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
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          order.status === "pending"
                            ? "bg-red-500 text-white"
                            : order.status === "completed"
                            ? "bg-green-500 text-white"
                            : "bg-gray-500 text-white"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="  px-4 py-3 flex gap-3 justify-center items-center">
                      {order.status !== "completed" && (
                        <button
                          onClick={() =>
                            updateOrderStatus(order.orderId, "completed")
                          }
                          className="group p-2 rounded-full bg-green-100 hover:bg-green-500 shadow-lg hover:shadow-xl cursor-pointer transition duration-200"
                          title="Mark as Completed"
                        >
                          <Check
                            className="h-5 w-5 text-green-600 group-hover:text-white"
                          />
                        </button>
                      )}
                      {order.status !== "cancelled" && (
                        <button
                          onClick={() =>
                            updateOrderStatus(order.orderId, "cancelled")
                          }
                          className="group p-2 rounded-full bg-red-100 hover:bg-red-500 shadow-lg hover:shadow-xl cursor-pointer transition duration-200"
                          title="Cancel Order"
                        >
                          <X className="h-5 w-5 text-red-600 group-hover:text-white" />
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
