/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import OwnerNavbar from "../../components/OwnerNavbar";
import "../../App.css";
import { FaCoins } from "react-icons/fa6";

const Profile = () => {
  const [owner, setOwner] = useState(null);
  const [paymentinfo, setPaymentinfo] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentData, setPaymentData] = useState([]); // 👈 orders array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOwnerProfile = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/owner/profile`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        console.log(response.data);
        setOwner(response.data.owner);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch profile");
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate("/owner/login");
        }
        console.error("Error fetching owner profile:", err.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerProfile();
  }, [navigate]);

  // 🔵 Payment Info Toggle + Fetch
  const tooglePaymentInfo = async () => {
    // agar already open hai to sirf close karo
    if (paymentinfo) {
      setPaymentinfo(false);
      return;
    }

    try {
      setPaymentLoading(true);

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/orders/paymentInfo`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Payment Info:", response.data);
      setPaymentData(response.data?.orders || []);
      setPaymentinfo(true);
    } catch (err) {
      console.error("Error fetching payment info:", err.response?.data || err);
      alert(
        err.response?.data?.message || "Failed to fetch payment information."
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString();
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
      style={{
        fontFamily: '"Gidole", sans-serif',
        fontWeight: 400,
        fontStyle: "normal",
      }}
    >
      <OwnerNavbar />
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center p-6 bg-red-50 rounded-lg">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          owner && (
            <div className="max-w-4xl mx-auto">
              <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                <div className="relative px-6 pb-6">
                  <div className="flex flex-col md:flex-row items-center md:items-end -mt-20 md:-mt-16 space-y-4 md:space-y-0 md:space-x-6">
                    <img
                      src={
                        owner?.profilePicture?.startsWith("data:image")
                          ? owner.profilePicture
                          : "https://img.icons8.com/ios7/1200/landlord.jpg"
                      }
                      alt="Profile"
                      className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                    />

                    <div className="text-center md:text-left w-full">
                      <h1 className="text-3xl font-bold text-gray-900">
                        {owner.firstname} {owner.lastname}
                      </h1>
                      <div className="flex flex-col md:flex-row gap-4 items-center justify-between w-full mt-2">
                        <p className="text-gray-600">
                          {owner.email} - {owner.contact}
                        </p>

                        {/* Wallet Badge + Payment Info Popup Trigger */}
                        <button onClick={tooglePaymentInfo} className="focus:outline-none">
                          <div className="flex cursor-pointer items-center gap-3 bg-gradient-to-r from-yellow-100 to-amber-200 border border-amber-300 rounded-xl px-4 py-2 shadow-md backdrop-blur-sm w-fit">
                            <div className="flex items-center justify-center bg-amber-300 rounded-full p-2 shadow-inner">
                              <FaCoins size={22} className="text-yellow-600" />
                            </div>
                            <div className="flex flex-col leading-tight">
                              <span className="text-[11px] font-semibold text-amber-700 tracking-widest uppercase">
                                Wallet Balance
                              </span>
                              <span className="text-xl font-bold text-amber-900">
                                ₹ {owner.balance ?? 0}
                              </span>
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {["Total Sales", "Products", "Orders"].map((title, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                  >
                    <h3 className="text-lg font-semibold text-gray-800 text-center">
                      {title}
                    </h3>
                    <p className="text-3xl font-bold text-blue-600 mt-2 text-center">
                      {["9999+", "4890", "999+"][index]}
                    </p>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <button
                  onClick={() => navigate("/owner/Add-Items")}
                  className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-colors w-full"
                >
                  <span>Add New Product</span>
                </button>
                <button
                  onClick={() => navigate("/owner/editProfile")}
                  className="flex items-center justify-center space-x-2 bg-pink-900 text-white px-6 py-3 rounded-lg shadow-md hover:bg-pink-800 transition-colors w-full"
                >
                  <span>Edit</span>
                </button>
              </div>
            </div>
          )
        )}
      </div>

      {/* 🧾 Payment Information Popup */}
      {paymentinfo && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-11/12 max-w-3xl max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                Payment Information
              </h2>
              <button
                onClick={tooglePaymentInfo}
                className="text-gray-500 hover:text-gray-800 text-xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Owner summary */}
            <div className="mb-4 text-sm text-gray-700">
              <p>
                <span className="font-semibold">Owner:</span> {owner.firstname}{" "}
                {owner.lastname}
              </p>
              <p>
                <span className="font-semibold">Wallet Balance:</span> ₹{" "}
                {owner.balance ?? 0}
              </p>
            </div>

            {/* Payment list */}
            <div className="flex-1 overflow-auto border rounded-xl">
              {paymentLoading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : paymentData.length === 0 ? (
                <div className="flex items-center justify-center h-40 text-gray-500">
                  No online payments found.
                </div>
              ) : (
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-100 text-gray-700 text-xs uppercase">
                    <tr>
                      <th className="px-3 py-2 text-left">User ID</th>
                      <th className="px-3 py-2 text-left">Product ID</th>
                      <th className="px-3 py-2 text-left">Txn ID</th>
                      <th className="px-3 py-2 text-right">₹ Amount</th>
                      <th className="px-3 py-2 text-center">Status</th>
                      <th className="px-3 py-2 text-left">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {paymentData.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-3 py-2">
                          <span className="font-mono text-xs">
                            {order.userId}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <span className="font-mono text-xs">
                            {order.productId}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <span className="font-mono text-xs">
                            {order.transactionId}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-right font-semibold">
                          ₹ {order.amount}
                        </td>
                        <td className="px-3 py-2 text-center">
                          <span
                            className={`px-2 py-1 rounded-full text-[11px] font-semibold ${
                              order.paymentStatus === "Success"
                                ? "bg-green-100 text-green-700"
                                : order.paymentStatus === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-xs text-gray-600">
                          {formatDate(order.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Footer Button */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={tooglePaymentInfo}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
