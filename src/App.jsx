import { Routes, Route } from 'react-router-dom'
import Storefront from './layouts/Storefront.jsx'
import Home from './pages/Home.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import CartPage from './pages/CartPage.jsx'
import NotFound from './pages/NotFound.jsx'
import AdminLayout from './admin/AdminLayout.jsx'
import Login from './admin/Login.jsx'
import Dashboard from './admin/Dashboard.jsx'
import ProductsManager from './admin/ProductsManager.jsx'
import OrdersManager from './admin/OrdersManager.jsx'
import ProtectedRoute from './admin/ProtectedRoute.jsx'

export default function App() {
  return (
    <Routes>
      {/* Storefront */}
      <Route element={<Storefront />}>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<CartPage />} />
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
        <Route path="orders" element={<OrdersManager />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
