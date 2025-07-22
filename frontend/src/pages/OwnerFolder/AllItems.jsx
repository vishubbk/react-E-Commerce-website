import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import OwnerNavbar from "../../components/OwnerNavbar.jsx";

const AllItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/owner/dashboard`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setItems(response.data.reverseProducts || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching items:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <OwnerNavbar />
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-3xl font-bold text-center mb-6">All Items</h2>

        {loading ? (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item._id}
                className="min-h-100 max-h-150 shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                style={{
                  backgroundColor: item.bgcolor || "#ffffff",
                  color: item.textcolor || "#000000",
                  border: `2px solid ${item.panelcolor || "#cccccc"}`,
                }}
              >
                <div className="relative h-48 overflow-hidden rounded-md">
                  <img
                    src={item.image?.url || "https://via.placeholder.com/150"}
                    alt={item.name}
                    className="absolute inset-0 w-full h-full object-contain hover:scale-110 transition duration-500"
                  />
                </div>

                <div className="p-4">
                  <h3 className="text-xl font-semibold">
                    {item.name.length <= 80
                      ? item.name
                      : item.name.substring(0, 80) + "..."}
                  </h3>

                  <p className="text-gray-700 text-sm mt-2">{item.description}</p>

                  <div className="flex gap-3 items-center mt-2">
                    <strike className="text-black-600 font-sm">
                      ₹{item.price}
                    </strike>
                    <p className="text-lg font-bold text-green-600">
                      ₹{item.discount}
                    </p>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <span
                      className="w-4 h-4 rounded-full border"
                      title="Background Color"
                      style={{ backgroundColor: item.bgcolor }}
                    />
                    <span
                      className="w-4 h-4 rounded-full border"
                      title="Text Color"
                      style={{ backgroundColor: item.textcolor }}
                    />
                    <span
                      className="w-4 h-4 rounded-full border"
                      title="Panel Color"
                      style={{ backgroundColor: item.panelcolor }}
                    />
                  </div>

                  <button
                    onClick={() => navigate(`/owner/EditProduct/${item._id}`)}
                    className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No items available.</p>
        )}
      </div>
    </>
  );
};

export default AllItems;
