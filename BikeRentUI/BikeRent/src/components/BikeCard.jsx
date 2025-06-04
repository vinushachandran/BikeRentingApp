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
  refresh,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    days: "",
  });
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [extendData, setExtendData] = useState({
    endDate: "",
  });

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
        refresh();
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

  const imageSrc =
    bike.image || bike.bikeDetails.image
      ? `data:image/jpeg;base64,${bike.image || bike.bikeDetails.image}`
      : "/placeholder-bike.jpg";

  const handleExtendClick = () => {
    setExtendData({
      endDate: bike.endDate.split("T")[0],
    });
    setShowExtendModal(true);
  };

  const handleExtendSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `https://localhost:7176/api/Booking/extend`,
        {
          bookingID: bike.bookingID,
          newEndDate: new Date(extendData.endDate).toISOString(),
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        Swal.fire("Success", "Rental extended successfully!", "success");
        setShowExtendModal(false);
        refresh();
        refreshRentBike();
      } else {
        Swal.fire(
          "Error",
          response.data.message || "Something went wrong",
          "error"
        );
      }
    } catch (err) {
      Swal.fire("Error", "Failed to extend rental.", "error");
      console.error(err);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-between border border-gray-300 shadow rounded-xl p-4 w-full max-w-full bg-white hover:shadow-lg transition min-h-[150px]">
        <div className="flex justify-center items-center">
          <img
            src={imageSrc}
            alt={bike.name}
            className="w-[100px] h-[100px] object-fill rounded-md mb-2"
          />
        </div>
        <h3 className="text-xl font-semibold">
          Bike number : {bike.bikeNumber || bike.bikeDetails.bikeNumber}
        </h3>
        <p className="text-sm text-gray-600">
          Location: {bike.address || bike.bikeDetails.address}{" "}
        </p>
        <p className="text-sm text-gray-600">
          Rent: Rs.{bike.rentalPrice || bike.bikeDetails.rentalPrice}/day
        </p>
        {returnMode && (
          <>
            <p className="text-sm text-gray-600">
              Start date: {new Date(bike.startDate).toLocaleDateString("en-CA")}
            </p>
            <p className="text-sm text-gray-600">
              End date: {new Date(bike.endDate).toLocaleDateString("en-CA")}
            </p>
          </>
        )}
        {!returnMode && bike.booked && (
          <>
            <>
              <p className="text-sm text-gray-600">
                Start date:{" "}
                {new Date(bike.bookedInfo[0].startDate).toLocaleDateString(
                  "en-CA"
                ) || ""}
              </p>
              <p className="text-sm text-gray-600">
                End date:{" "}
                {new Date(bike.bookedInfo[0].endDate).toLocaleDateString(
                  "en-CA"
                ) || ""}
              </p>
            </>
          </>
        )}
        <div className="mt-4 space-y-2">
          {host ? (
            <button
              className="bg-red-600 text-white px-4 py-2 rounded w-full"
              onClick={onDelete}
            >
              Delete Bike
            </button>
          ) : (
            <>
              {!returnMode && (
                <>
                  {!bike.booked ? (
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowModal(true);
                      }}
                    >
                      Rent Now
                    </button>
                  ) : (
                    <button className="bg-green-600 text-white px-4 py-2 rounded w-full">
                      Bike Booked
                    </button>
                  )}
                </>
              )}
              {returnMode && (
                <>
                  <button
                    className="bg-emerald-600 text-white px-4 py-2 rounded w-full"
                    onClick={handleExtendClick}
                  >
                    Extend Rent
                  </button>
                  <button
                    className="bg-emerald-900 text-white px-4 py-2 rounded w-full"
                    onClick={() => onReturnClick?.(bike)}
                  >
                    Return Bike
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {showExtendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
              onClick={() => setShowExtendModal(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">
              Extend Rental for "{bike.bikeDetails.bikeNumber}"
            </h2>
            <form className="space-y-4" onSubmit={handleExtendSubmit}>
              <div>
                <p className="text-sm text-gray-600">
                  Start Date:{" "}
                  {new Date(bike.startDate).toLocaleDateString("en-CA")}
                </p>
                <p className="text-sm text-gray-600">
                  Current End Date:{" "}
                  {new Date(bike.endDate).toLocaleDateString("en-CA")}
                </p>
              </div>
              <input
                type="date"
                name="endDate"
                value={extendData.endDate}
                onChange={(e) =>
                  setExtendData((prev) => ({
                    ...prev,
                    endDate: e.target.value,
                  }))
                }
                required
                min={bike.endDate.split("T")[0]}
                className="w-full border rounded px-3 py-2"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowExtendModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                >
                  Extend
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                min={new Date().toLocaleDateString("en-CA")}
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
