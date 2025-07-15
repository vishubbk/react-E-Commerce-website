import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Buynow from './pages/UserFolder/buynowSummery.jsx';
import UserCart from './pages/UserFolder/getCartItems.jsx';
import Home from './pages/UserFolder/Home.jsx';
import MyOrders from './pages/UserFolder/myOrders.jsx';
import OrderSuccess from './pages/UserFolder/orderSuccessPage.jsx';
import ProductsDetails from './pages/UserFolder/ProductsDetails.jsx';
import RouteProtection from './pages/UserFolder/RouteProtection.jsx';
import UserCreate from './pages/UserFolder/userCreate.jsx';
import UserLogin from './pages/UserFolder/userLogin.jsx';
import UserProfile from './pages/UserFolder/userProfile.jsx';
import UserProfileEdit from './pages/UserFolder/UserProfileEdit.jsx';
import Logout from './Logout.jsx';

import OwnerLogin from './pages/OwnerFolder/OwnerLogin.jsx';
import OwnerCreate from './pages/OwnerFolder/OwnerCreate.jsx';
import OwnerDashboard from './pages/OwnerFolder/OwnerDashboard.jsx';
import OwnerAllItems from './pages/OwnerFolder/AllItems.jsx';
import OwnerAddItems from './pages/OwnerFolder/AddItems.jsx';
import OwnerProfile from './pages/OwnerFolder/Profile.jsx';
import OwnerProfileEdit from './pages/OwnerFolder/EditProfile.jsx';
import OwnerAllOrders from './pages/OwnerFolder/AllOrdersShow.jsx';

import Privacy from './pages/Static/Privacy.jsx';
import Refund from './pages/Static/Refund.jsx';
import Terms from './pages/Static/Terms.jsx';
import Contact from './pages/Static/Contact.jsx';
import Shipping from './pages/Static/Shipping.jsx';


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
        {/* payment Protection Routes */}
        <Route path="/terms" element={<Terms />} />
        <Route path="/refund" element={<Refund />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/contact" element={<Contact />} />

        {/* Fallback Route */}
        <Route path="*" element={<RouteProtection />} />
      </Routes>
    </Router>
  );
};

export default App;
