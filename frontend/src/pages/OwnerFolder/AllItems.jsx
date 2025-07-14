import { useEffect, useState } from "react";
import axios from "axios";
import OwnerNavbar from "../../components/OwnerNavbar.jsx";


const AllItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

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
      setItems(response.data.products || []); // Ensure products exist
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
              className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="relative  h-48 overflow-hidden rounded-md">
                <img
                src={item.image?.url || "https://via.placeholder.com/150"}
                alt={item.name}
                className="absolute inset-0 w-full h-full object-contain hover:scale-110 transition duration-500"
              />
              </div>

              <div className="p-4">
                <h3 className="text-xl font-semibold">{item.name}</h3>
                <p className="text-gray-600 text-sm mt-2">{item.description}</p>
                <p className="text-lg font-bold text-green-600 mt-2">
                  ${item.price}
                </p>
                <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No items available.</p>
      )}
    </div>  </>
  );
};

export default AllItems;
