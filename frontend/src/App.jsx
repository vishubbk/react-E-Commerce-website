
import { Routes, Route } from 'react-router-dom'
import Home from './pages/UserFolder/Home'
import UserLogin from './pages/UserFolder/userLogin'
import UserCreate from './pages/UserFolder/userCreate'
import UserProfile from './pages/UserFolder/userProfile'
import UserProfileEdit from './pages/UserFolder/userProfileEdit'
import ProductsDetails from './pages/UserFolder/productsDetails'
import OwnerLogin from './pages/OwnerFolder/OwnerLogin'
import OwnerCreate from './pages/OwnerFolder/OwnerCreate'
import OwnerDashboard from './pages/OwnerFolder/OwnerDashboard'
import OwnerAllItems from './pages/OwnerFolder/OwnerAllItems'
import OwnerAddItems from './pages/OwnerFolder/OwnerAddItems'
import OwnerProfile from './pages/OwnerFolder/OwnerProfile'
import RouteProtection from './pages/RouteProtection'

const App = () => {
  return (
    <Routes>
      {/* User Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/users/login" element={<UserLogin />} />
      <Route path="/users/register" element={<UserCreate />} />
      <Route path="/users/profile" element={<UserProfile />} />
      <Route path="/users/profile/edit" element={<UserProfileEdit />} />
      <Route path="/products/:id" element={<ProductsDetails />} />

      {/* Owner Routes */}
      <Route path="/owner/login" element={<OwnerLogin />} />
      <Route path="/owner/register" element={<OwnerCreate />} />
      <Route path="/owner/dashboard" element={<OwnerDashboard />} />
      <Route path="/owner/all-items" element={<OwnerAllItems />} />
      <Route path="/owner/add-items" element={<OwnerAddItems />} />
      <Route path="/owner/profile" element={<OwnerProfile />} />

      {/* Protection Route */}
      <Route path="*" element={<RouteProtection />} />
    </Routes>
  )
}

export default App
