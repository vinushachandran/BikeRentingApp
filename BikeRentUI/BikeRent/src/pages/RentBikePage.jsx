import React, { useState } from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import BikeCard from "../components/BikeCard";
import ReturnBikeModal from "../components/ReturnBikeModal";

const bikesData = [
  {
    id: 1,
    name: "Mountain Bike",
    location: "New York",
    rent: 15,
    imageUrl: "/images/bike1.jpg",
  },
  {
    id: 2,
    name: "Road Bike",
    location: "Los Angeles",
    rent: 20,
    imageUrl: "/images/bike2.jpg",
  },
  {
    id: 3,
    name: "City Bike",
    location: "New York",
    rent: 10,
    imageUrl: "/images/bike3.jpg",
  },
];

const RentBikePage = () => {
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [rentedBikes, setRentedBikes] = useState([bikesData[0]]);
  const [returnMode, setReturnMode] = useState(false);
  const [selectedReturnBike, setSelectedReturnBike] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  const filteredBikes =
    selectedLocation === "All"
      ? bikesData
      : bikesData.filter((bike) => bike.location === selectedLocation);

  const handleReturnToggle = () => {
    setReturnMode((prev) => !prev);
    setSelectedReturnBike(null);
  };

  const handleBikeReturnClick = (bike) => {
    setSelectedReturnBike(bike);
  };

  const handleConfirmReturn = (bikeId) => {
    setRentedBikes((prev) => prev.filter((bike) => bike.id !== bikeId));
    setSelectedReturnBike(null);
  };

  const bikesToDisplay = returnMode ? rentedBikes : filteredBikes;
  const uniqueLocations = ["All", ...new Set(bikesData.map((b) => b.location))];

  return (
    <div>
      <DashboardNavbar name={"Renter"} />
      <div className="p-4 my-4 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4">
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
          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={handleReturnToggle}
          >
            {returnMode ? "Back to Rent" : "Return Bike"}
          </button>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {bikesToDisplay.map((bike) => (
            <BikeCard
              key={bike.id}
              bike={bike}
              returnMode={returnMode}
              onReturnClick={handleBikeReturnClick}
            />
          ))}
        </div>
      </div>

      {selectedReturnBike && (
        <ReturnBikeModal
          bike={selectedReturnBike}
          onClose={() => setSelectedReturnBike(null)}
          onConfirmReturn={handleConfirmReturn}
        />
      )}
    </div>
  );
};

export default RentBikePage;
