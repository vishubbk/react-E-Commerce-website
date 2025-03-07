import { Routes, Route } from 'react-router-dom';
import Home from './pages/UserFolder/Home';
import UserLogin from './pages/UserFolder/userLogin';
import UserCreate from './pages/UserFolder/userCreate';
import UserProfile from './pages/UserFolder/userProfile';
import UserProfileEdit from './pages/UserFolder/userProfileEdit';
import MyOrders from './pages/UserFolder/MyOrders';
import ProductsDetails from './pages/UserFolder/productsDetails';
import OrderSuccess from './pages/UserFolder/orderSuccessPage';
import UserCart from './pages/UserFolder/getCartItems';
import Buynow from './pages/UserFolder/buynowSummery';
import Logout from './pages/UserFolder/Logout';

import OwnerLogin from './pages/OwnerFolder/OwnerLogin';
import OwnerCreate from './pages/OwnerFolder/OwnerCreate';
import OwnerDashboard from './pages/OwnerFolder/OwnerDashboard';
import OwnerAllItems from './pages/OwnerFolder/OwnerAllItems';
import OwnerAddItems from './pages/OwnerFolder/OwnerAddItems';
import OwnerProfile from './pages/OwnerFolder/OwnerProfile';
import OwnerProfileEdit from './pages/OwnerFolder/OwnerProfileEdit';
import OwnerAllOrders from './pages/OwnerFolder/OwnerAllOrdersShow';

import RouteProtection from './pages/RouteProtection';

const App = () => {
  return (
    <Routes>
      {/* Home Route */}
      <Route path="/" element={<Home />} />

      {/* User Routes */}
      <Route path="/users/register" element={<UserCreate />} />
      <Route path="/users/login" element={<UserLogin />} />
      <Route path="/users/profile" element={<UserProfile />} />
      <Route path="/users/profile/edit" element={<UserProfileEdit />} />
      <Route path="/users/getCartItems" element={<UserCart />} />
      <Route path="/users/buynow/:id" element={<Buynow />} />
      <Route path="/users/orderSuccess/:id" element={<OrderSuccess />} />
      <Route path="/users/logout" element={<Logout />} />
      <Route path="/users/Order" element={<MyOrders />} />

      {/* Owner Routes */}
      <Route path="/owner/register" element={<OwnerCreate />} />
      <Route path="/owner/login" element={<OwnerLogin />} />
      <Route path="/owner/dashboard" element={<OwnerDashboard />} />
      <Route path="/owner/all-items" element={<OwnerAllItems />} />
      <Route path="/owner/add-items" element={<OwnerAddItems />} />
      <Route path="/owner/profile" element={<OwnerProfile />} />
      <Route path="/owner/edit-profile" element={<OwnerProfileEdit />} />
      <Route path="/owner/all-orders" element={<OwnerAllOrders />} />

      {/* Product Routes */}
      <Route path="/products/:id" element={<ProductsDetails />} />

      {/* Route Protection */}
      <Route path="*" element={<RouteProtection />} />
    </Routes>
  );
};

export default App;
