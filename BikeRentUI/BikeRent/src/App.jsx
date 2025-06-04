import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/Signup";
import HomePage from "./pages/HomePage";
import RentBikePage from "./pages/RentBikePage";
import HostBikePage from "./pages/HostBikePage";
import AdminDashboard from "./pages/AdminDashboard";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={["User", "Tourist"]}>
              <HomePage />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rent-bike"
          element={
            <ProtectedRoute allowedRoles={["Tourist"]}>
              <RentBikePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/host-bike"
          element={
            <ProtectedRoute allowedRoles={["User"]}>
              <HostBikePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
