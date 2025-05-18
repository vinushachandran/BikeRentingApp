import React, { useEffect, useState } from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import BikeCard from "../components/BikeCard";
import ReturnBikeModal from "../components/ReturnBikeModal";
import axios from "axios";

const RentBikePage = () => {
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [rentedBikes, setRentedBikes] = useState([]);
  const [returnMode, setReturnMode] = useState(false);
  const [selectedReturnBike, setSelectedReturnBike] = useState(null);

  const [bikes, setBikes] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchBikes = async () => {
    try {
      const response = await axios.get("https://localhost:7176/api/bikes");
      if (response.data.success) {
        const availableBikes = response.data.data.filter(
          (bike) => bike.availabilityStatus && bike.hostID !== user.userId
        );
        setBikes(availableBikes);
      } else {
        console.warn("Failed to fetch bikes:", response.data.message);
      }
    } catch (error) {
      console.error("Caught error while fetching bikes:", error.message);
    }
  };

  const fetchRentedBikes = async () => {
    try {
      const response = await axios.get("https://localhost:7176/api/Booking");

      if (response.data.success) {
        const userBookings = response.data.data.filter(
          (booking) => booking.customerID === user.userId
        );
        const activeBookings = userBookings.filter(
          (booking) => booking.status !== "Returned"
        );

        const bikeDetailsPromises = activeBookings.map((booking) =>
          axios.get(`https://localhost:7176/api/bikes/${booking.bikeID}`)
        );

        const bikeDetailsResponses = await Promise.all(bikeDetailsPromises);

        const bookedWithBikeInfo = activeBookings.map((booking, index) => ({
          ...booking,
          bikeDetails: bikeDetailsResponses[index].data.data,
        }));

        setRentedBikes(bookedWithBikeInfo);
      } else {
        console.warn("Failed to fetch bookings:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching rented bikes:", error);
    }
  };

  useEffect(() => {
    fetchBikes();
    fetchRentedBikes();
  }, []);

  const filteredBikes =
    selectedLocation === "All"
      ? bikes
      : bikes.filter((bike) => bike.location === selectedLocation);

  const handleReturnToggle = () => {
    setReturnMode((prev) => !prev);
    setSelectedReturnBike(null);
  };

  const handleBikeReturnClick = (bike) => {
    const foundBike = rentedBikes.find((b) => b.id === bike.id);
    setSelectedReturnBike(foundBike);
  };

  const handleConfirmReturn = (bikeId) => {
    setRentedBikes((prev) => prev.filter((bike) => bike.id !== bikeId));
    setSelectedReturnBike(null);
  };

  const bikesToDisplay = returnMode ? rentedBikes : filteredBikes;
  const uniqueLocations = ["All", ...new Set(bikes.map((b) => b.location))];

  return (
    <div>
      <DashboardNavbar name={"Renter"} />
      <div className="p-4 my-4 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          {!returnMode ? (
            <>
              <div>
                <label className="mr-2 text-lg font-medium">
                  Filter by Location:
                </label>
                <select
                  className="border border-gray-300 px-3 py-1 rounded"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  disabled={returnMode}
                >
                  {uniqueLocations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            <>
              <div></div>
            </>
          )}
          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={handleReturnToggle}
          >
            {returnMode ? "Back to Rent" : "Return Bike"}
          </button>
        </div>

        {bikesToDisplay.length === 0 ? (
          <div className="text-center text-gray-500 mt-10 text-xl">
            {returnMode
              ? "You haven't rented any bikes."
              : "No bikes available."}
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {bikesToDisplay.map((bike) => (
              <BikeCard
                key={bike.bikeID}
                bike={bike}
                returnMode={returnMode}
                onReturnClick={handleBikeReturnClick}
                refreshRentBike={fetchRentedBikes}
              />
            ))}
          </div>
        )}
      </div>

      {selectedReturnBike && (
        <ReturnBikeModal
          bike={selectedReturnBike}
          onClose={() => setSelectedReturnBike(null)}
          onConfirmReturn={handleConfirmReturn}
          refresh={fetchRentedBikes}
        />
      )}
    </div>
  );
};

export default RentBikePage;
