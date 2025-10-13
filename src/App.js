import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import AddProduct from "./components/AddProduct";
import ProductDetail from "./components/ProductDetail";
import Login from "./components/Login";
import Register from "./components/Register";
import AdminPanel from "./components/AdminPanel";
import { AuthProvider } from "./context/AuthContext";
import AdminRoute from "./components/AdminRoute";
import EditProduct from "./components/EditProduct";
import AdminOrdersPanel from "./components/AdminOrdersPanel";
import AdminProductsPanel from "./components/AdminProductsPanel";
import CartPage from "./components/CartPage";

const App = () => {
  return (
    <AuthProvider> {/* 👈 Wrappa tutto nel contesto auth */}
      <Router>
        <Navbar />

        <Routes>
          {/* 🌐 Rotte pubbliche */}
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/cart" element={<CartPage />} />

          {/* 🔒 Rotte protette per Admin */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <AdminRoute>
                <AdminProductsPanel />
              </AdminRoute>
            }
          />
          <Route
            path="/add-product"
            element={
              <AdminRoute>
                <AddProduct />
              </AdminRoute>
            }
          />
          <Route
            path="/edit-product/:id"
            element={
              <AdminRoute>
                <EditProduct />
              </AdminRoute>
            }
          />
          <Route path="/products/add"
            element={
              <AdminRoute>
                <AddProduct />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                <AdminOrdersPanel />
              </AdminRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
