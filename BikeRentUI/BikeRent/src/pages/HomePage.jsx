import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import axios from "axios";
import BikeCard from "../components/BikeCard";

const HomePage = () => {
  const navigate = useNavigate();
  const [bikes, setBikes] = useState([]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchBikes();
  }, []);

  const fetchBikes = async () => {
    try {
      const responseBooking = await axios.get(
        "https://localhost:7176/api/Booking"
      );
      const bookedBike = responseBooking.data.data.filter(
        (booking) => booking.status !== "Returned"
      );

      const response = await axios.get("https://localhost:7176/api/bikes");

      if (response.data.success) {
        const availableBikes = response.data.data
          .filter(
            (bike) => bike.availabilityStatus && bike.hostID !== user.userId
          )
          .map((bike) => {
            const matchingBookings = bookedBike.filter(
              (booking) => booking.bikeID === bike.bikeID
            );

            return {
              ...bike,
              booked: matchingBookings.length > 0,
              bookedInfo: matchingBookings,
            };
          });

        setBikes(availableBikes);
      } else {
        console.warn("Failed to fetch bikes:", response.data.message);
      }
    } catch (error) {
      console.error("Caught error while fetching bikes:", error.message);
    }
  };

  return (
    <div>
      <NavBar />
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="block md:grid md:grid-cols-4 py-10 w-full max-w-7xl">
          <div className="col-span-2 flex items-center p-6">
            <div className="">
              <h1 className="capitalize text-5xl font-semibold">
                Make your ride easy & affordable
              </h1>
              <p className="text-gray-400 py-4">
                Embark on a journey through Sri Lanka's culture with authentic
                experiences and effortless bike rentals. Your adventure starts
                now
              </p>
              <div className="flex items-center font-bold py-3 flex-wrap gap-3">
                {(user.role == "Admin" || user.role == "Tourist") && (
                  <>
                    <button
                      className="cursor-pointer p-2 px-5 rounded-3xl bg-red-500 text-white mr-5"
                      onClick={() => handleNavigation("/rent-bike")}
                    >
                      Start your Journey / Return bike
                    </button>
                  </>
                )}
                {(user.role == "Admin" || user.role == "User") && (
                  <>
                    <button
                      className="cursor-pointer p-2 px-5 rounded-3xl bg-black text-white"
                      onClick={() => handleNavigation("/host-bike")}
                    >
                      Host Now
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="col-span-2 flex justify-center items-center">
            <div className="h-[300px] w-[300px]">
              <img className="object-fill" src="./src/assets/dio.png" />
            </div>
          </div>
        </div>
      </div>
      <div className="py-2 px-5">
        {(user.role == "Admin" || user.role == "Tourist") && (
          <>
            <div className="uppercase text-2xl p-2 font-bold">All Bikes</div>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {bikes.map((bike) => (
                <BikeCard key={bike.bikeID} bike={bike} />
              ))}
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
