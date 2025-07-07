import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/UserFolder/Home';
import UserLogin from './pages/UserFolder/userLogin';
import UserCreate from './pages/UserFolder/userCreate';
import UserProfile from './pages/UserFolder/userProfile';
import UserProfileEdit from './pages/UserFolder/userProfileEdit';
import MyOrders from './pages/UserFolder/MyOrders';
import ProductsDetails from './pages/UserFolder/productsDetails';
import UserCart from './pages/UserFolder/getCartItems';
import Buynow from './pages/UserFolder/buynowSummery';
import OrderSuccess from './pages/UserFolder/orderSuccessPage';
import Logout from './Logout';

import OwnerLogin from './pages/OwnerFolder/OwnerLogin';
import OwnerCreate from './pages/OwnerFolder/OwnerCreate';
import OwnerDashboard from './pages/OwnerFolder/OwnerDashboard';
import OwnerAllItems from './pages/OwnerFolder/AllItems';
import OwnerAddItems from './pages/OwnerFolder/AddItems';
import OwnerProfile from './pages/OwnerFolder/Profile';
import OwnerProfileEdit from './pages/OwnerFolder/EditProfile';
import OwnerAllOrders from './pages/OwnerFolder/AllOrdersShow';

import RouteProtection from './pages/UserFolder/RouteProtection';

const App = () => {
  return (
    <Router>
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
        <Route path="/owner/editProfile" element={<OwnerProfileEdit />} />
        <Route path="/owner/AllOrders" element={<OwnerAllOrders />} />

        {/* Product Routes */}
        <Route path="/products/:id" element={<ProductsDetails />} />

        {/* Fallback Route */}
        <Route path="*" element={<RouteProtection />} />
      </Routes>
    </Router>
  );
};

export default App;
