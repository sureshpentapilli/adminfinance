import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import AdminLogin from "./components/AdminLogin";
import AdminDashboardregister from "./components/AdminDashboard";

import Vendors from "./components/Vendors";
import Orders from "./components/Orders";
import AdminCreditStatus from "./components/AdminCreditStatus";

// Mock function to check if the admin is logged in (expand based on your auth logic)
const isAdminAuthenticated = () => {
  return localStorage.getItem("adminToken") ? true : false;
};

// PrivateRoute Component for Admin Dashboard Protection
const PrivateRoute = ({ children }) => {
  return isAdminAuthenticated() ? (
    children
  ) : (
    <Navigate to="/adminlogin" replace />
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}

        <Route path="/" element={<AdminLogin />} />

        {/* Protected Route for Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminDashboardregister />
            </PrivateRoute>
          }
        />
        <Route path="/admin/orders" element={<Orders />} />
        <Route path="/admin/vendors" element={<Vendors />} />
        <Route path="/admin/status" element={<AdminCreditStatus />} />

        {/* User Dashboard with Nested Routes */}

        {/* Fallback Route for Unknown Paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
