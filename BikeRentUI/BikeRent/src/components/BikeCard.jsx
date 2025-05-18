import React, { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const BikeCard = ({
  bike,
  returnMode,
  onReturnClick,
  host,
  onDelete,
  refreshRentBike,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    days: "",
  });

  bike = bike.bikeDetails || bike;

  const user = JSON.parse(localStorage.getItem("user"));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  function calculateEndDate(startDateStr, days) {
    const start = new Date(startDateStr);
    start.setDate(start.getDate() + Number(days));
    return start.toISOString();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const startDateISO = new Date(formData.startDate).toISOString();

    const bookingData = {
      customerID: user?.userId,
      bikeID: bike.bikeID,
      startDate: startDateISO,
      endDate: calculateEndDate(formData.startDate, formData.days),
      status: "Pending",
    };
    try {
      const response = await axios.post(
        "https://localhost:7176/api/Booking",
        bookingData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Booking Confirmed!",
          text: `Thank you, ${formData.name}! You booked "${bike.bikeNumber}" for ${formData.days} day(s).`,
        });
        setFormData({ name: "", startDate: "", days: "" });
        refreshRentBike();
        setShowModal(false);
      } else {
        Swal.fire({
          icon: "error",
          title: "Booking Failed",
          text: response.data.message || "Something went wrong.",
        });
      }
    } catch (error) {
      console.error("Booking error:", error.response.data.message);
      Swal.fire({
        icon: "error",
        title: "Booking Error",
        text: "Booking failed." + error.response.data.message,
      });
    }
  };

  const imageSrc = bike.image
    ? `data:image/jpeg;base64,${bike.image}`
    : "/placeholder-bike.jpg";

  return (
    <>
      <div
        className={`border border-gray-300 shadow rounded-xl p-4 w-full max-w-full bg-white cursor-pointer hover:shadow-lg transition`}
      >
        <img
          src={imageSrc}
          alt={bike.name}
          className="w-full h-40 object-fill rounded-md mb-2"
        />
        <h3 className="text-xl font-semibold">
          Bike number : {bike.bikeNumber}
        </h3>
        <p className="text-sm text-gray-600">Location: {bike.address}</p>
        <p className="text-sm text-gray-600">Rent: Rs.{bike.rentalPrice}/day</p>
        {host ? (
          <button
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded w-full"
            onClick={() => {
              onDelete();
            }}
          >
            Delete Bike
          </button>
        ) : (
          <>
            {!returnMode && (
              <button
                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowModal(true);
                }}
              >
                Rent Now
              </button>
            )}
            {returnMode && (
              <button
                className="mt-2 bg-emerald-900 text-white px-4 py-2 rounded w-full"
                onClick={() => returnMode && onReturnClick?.(bike)}
              >
                Return Bike
              </button>
            )}
          </>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Rent "{bike.bikeNumber}"</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full border rounded px-3 py-2"
              />
              {/* Start Date input */}
              <input
                type="date"
                name="startDate"
                value={formData.startDate || ""}
                onChange={handleInputChange}
                required
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="number"
                name="days"
                placeholder="Days to Rent"
                value={formData.days}
                onChange={handleInputChange}
                required
                min={1}
                className="w-full border rounded px-3 py-2"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default BikeCard;
