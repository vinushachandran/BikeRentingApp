import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/Signup";
import HomePage from "./pages/HomePage";
import TouristDashboard from "./pages/TouristDashboard";
import RentBikePage from "./pages/RentBikePage";
import HostBikePage from "./pages/HostBikePage";
import AdminDashboard from "./pages/AdminDashboard";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/rent-bike" element={<RentBikePage />} />
          <Route path="/host-bike" element={<HostBikePage />} />
          <Route path="/tourist-dashboard" element={<TouristDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
