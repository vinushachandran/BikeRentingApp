import React from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import RequestTracking from "../components/RequestTracking";
import BikeRentals from "../components/BikeRentals";
import Booking from "../components/Booking";
import Feedback from "../components/Feedback";
import Footer from "../components/Footer";

const TouristDashboard = () => {
  return (
    <div className="bg-gray-100">
      <DashboardNavbar />

      <div className="p-4">
        <RequestTracking />

        <BikeRentals />

        <Booking />

        <Feedback />
      </div>
      <Footer />
    </div>
  );
};

export default TouristDashboard;
