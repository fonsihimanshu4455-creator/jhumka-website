import { Routes, Route } from 'react-router-dom'
import Storefront from './layouts/Storefront.jsx'
import Home from './pages/Home.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import CartPage from './pages/CartPage.jsx'
import Checkout from './pages/Checkout.jsx'
import Account from './pages/Account.jsx'
import NotFound from './pages/NotFound.jsx'
import AdminLayout from './admin/AdminLayout.jsx'
import Login from './admin/Login.jsx'
import Dashboard from './admin/Dashboard.jsx'
import ProductsManager from './admin/ProductsManager.jsx'
import OrdersManager from './admin/OrdersManager.jsx'
import CategoriesManager from './admin/CategoriesManager.jsx'
import CouponsManager from './admin/CouponsManager.jsx'
import SettingsManager from './admin/SettingsManager.jsx'
import CustomersManager from './admin/CustomersManager.jsx'
import ProtectedRoute from './admin/ProtectedRoute.jsx'

export default function App() {
  return (
    <Routes>
      {/* Storefront */}
      <Route element={<Storefront />}>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/account" element={<Account />} />
      </Route>

      {/* Admin */}
      <Route path="/admin/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="products" element={<ProductsManager />} />
        <Route path="categories" element={<CategoriesManager />} />
        <Route path="orders" element={<OrdersManager />} />
        <Route path="customers" element={<CustomersManager />} />
        <Route path="coupons" element={<CouponsManager />} />
        <Route path="settings" element={<SettingsManager />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
