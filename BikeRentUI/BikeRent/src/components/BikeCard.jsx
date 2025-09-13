import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const BikeCard = ({
  bike,
  returnMode,
  onReturnClick,
  host,
  onDelete,
  refreshRentBike,
  onUpdateBike,
}) => {
  // Get logged-in user
  const user = JSON.parse(localStorage.getItem("user"));

  // Rent modal state (auto-fill name)
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.username || user?.firstName || "",
    depositAmount: "",
    startDate: "",
    days: "",
  });

  // Extend rental modal state
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [extendData, setExtendData] = useState({ endDate: "" });

  // Update bike modal state
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateData, setUpdateData] = useState({
    bikeID: 0,
    bikeNumber: "",
    type: "",
    address: "",
    rentalPrice: "",
    hostID: 0,
    availabilityStatus: true,
    image: null,
    previewUrl: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateEndDate = (startDateStr, days) => {
    const start = new Date(startDateStr);
    start.setDate(start.getDate() + Number(days));
    return start.toISOString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Confirmation popup
    const result = await Swal.fire({
      title: "Confirm Booking",
      text: `Are you sure you want to book "${bike.bikeNumber}" for ${formData.days} day(s)?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Book it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) {
      return; // Stop if canceled
    }

    const startDateISO = new Date(formData.startDate).toISOString();
    const bookingData = {
      customerID: user?.userId,
      bikeID: bike.bikeID,
      startDate: startDateISO,
      depositAmount: parseFloat(formData.depositAmount),
      endDate: calculateEndDate(formData.startDate, formData.days),
      status: "Pending",
    };

    try {
      const response = await axios.post(
        "https://localhost:7176/api/Booking",
        bookingData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success === true) {
        console.log("✅ Booking successful:", {
          bookingData,
          serverResponse: response.data,
        });
        Swal.fire({
          icon: "success",
          title: "Booking Confirmed!",
          text: `Thank you, ${formData.name}! You booked "${bike.bikeNumber}" for ${formData.days} day(s).`,
        });
        setFormData({
          name: user?.username || user?.firstName || "",
          startDate: "",
          days: "",
          depositAmount: "",
        });
        refreshRentBike();
        setShowModal(false);
      } else {
        console.warn("❌ Booking failed:", response.data);

        Swal.fire({
          icon: "error",
          title: "Booking Failed",
          text: response.data.message || "Something went wrong.",
        });
      }
    } catch (err) {
      if (err.response) {
        // Server responded but with non-2xx
        console.error(
          "🚨 API responded with error:",
          err.response.status,
          err.response.data
        );
      } else if (err.request) {
        // No response from server
        console.error("🚨 No response received:", err.request);
      } else {
        // Something else
        console.error("🚨 Request setup error:", err.message);
      }

      Swal.fire("Error", "Failed to process booking.", "error");
    }
  };

  const imageSrc =
    bike.image || bike.bikeDetails?.image
      ? `data:image/jpeg;base64,${bike.image || bike.bikeDetails.image}`
      : "/placeholder-bike.jpg";

  const handleExtendClick = () => {
    setExtendData({ endDate: bike.endDate.split("T")[0] });
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
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        Swal.fire("Success", "Rental extended successfully!", "success");
        setShowExtendModal(false);
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

  const openUpdateModal = () => {
    setUpdateData({
      bikeID: bike.bikeID,
      hostID: bike.hostID,
      bikeNumber: bike.bikeNumber || bike.bikeDetails?.bikeNumber || "",
      type: bike.type || "",
      address: bike.address || bike.bikeDetails?.address || "",
      rentalPrice: bike.rentalPrice || bike.bikeDetails?.rentalPrice || "",
      availabilityStatus:
        bike.availabilityStatus !== undefined ? bike.availabilityStatus : true,
      image: null,
      previewUrl: bike.image
        ? `data:image/jpeg;base64,${bike.image}`
        : bike.bikeDetails?.image
        ? `data:image/jpeg;base64,${bike.bikeDetails.image}`
        : null,
    });
    setShowUpdateModal(true);
  };

  const handleUpdateInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateData((prev) => ({
      ...prev,
      [name]:
        name === "availabilityStatus"
          ? value === "true"
          : name === "rentalPrice"
          ? Number(value)
          : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUpdateData((prev) => ({
        ...prev,
        image: file,
        previewUrl: URL.createObjectURL(file),
      }));
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    if (!updateData.bikeNumber.trim()) {
      Swal.fire("Error", "Bike number is required", "error");
      return;
    }
    if (!updateData.type.trim()) {
      Swal.fire("Error", "Bike type is required", "error");
      return;
    }
    if (!updateData.address.trim()) {
      Swal.fire("Error", "Address is required", "error");
      return;
    }
    if (!updateData.rentalPrice || parseFloat(updateData.rentalPrice) <= 0) {
      Swal.fire("Error", "Rental price must be greater than 0", "error");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("BikeID", updateData.bikeID);
      formData.append("BikeNumber", updateData.bikeNumber);
      formData.append("Type", updateData.type);
      formData.append("Address", updateData.address);
      formData.append("RentalPrice", updateData.rentalPrice);
      formData.append("HostID", updateData.hostID);
      formData.append("AvailabilityStatus", updateData.availabilityStatus);
      if (updateData.image) {
        formData.append("ImageFile", updateData.image);
      }

      const response = await axios.put(
        `https://localhost:7176/api/bikes/update`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.success === true) {
        Swal.fire("Success", "Bike details updated successfully!", "success");
        setShowUpdateModal(false);
        if (onUpdateBike) {
          await onUpdateBike(updateData);
        }
      } else {
        Swal.fire(
          "Error",
          response.data.message || "Failed to update bike",
          "error"
        );
      }
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to update bike",
        "error"
      );
      console.error(error);
    }
  };

  // Reviews modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  const [users, setUsers] = useState([]);

  // Fetch all users once (call this in useEffect when component mounts)
  const fetchUsers = async () => {
    try {
      const response = await axios.get("https://localhost:7176/api/User");
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.error("Caught error:", error.message);
    }
  };

  useEffect(() => {
    fetchUsers(); // fetch all users once
  }, []);

  // Fetch reviews and attach customer names
  const fetchReviews = async (bikeID) => {
    try {
      setLoadingReviews(true);
      const response = await axios.get(
        `https://localhost:7176/api/Review/bike/${bikeID}`
      );

      const reviewsData = response.data.data || [];

      // Map customerID to user name
      const reviewsWithNames = reviewsData.map((review) => {
        const user = users.find((u) => u.userId === review.customerID);
        return { ...review, customerName: user ? user.username : "Anonymous" };
      });

      setReviews(reviewsWithNames);
    } catch (err) {
      console.error("🚨 Failed to fetch reviews:", err);
      Swal.fire("Error", "Unable to load reviews.", "error");
    } finally {
      setLoadingReviews(false);
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
          Bike number : {bike.bikeNumber || bike.bikeDetails?.bikeNumber}
        </h3>
        <p className="text-sm text-gray-600">
          Location: {bike.address || bike.bikeDetails?.address}{" "}
        </p>
        <p className="text-sm text-gray-600">
          Rent: Rs.{bike.rentalPrice || bike.bikeDetails?.rentalPrice}/day
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
            <p className="text-sm text-gray-600">
              Start date:{" "}
              {new Date(bike.bookedInfo[0]?.startDate).toLocaleDateString(
                "en-CA"
              ) || ""}
            </p>
            <p className="text-sm text-gray-600">
              End date:{" "}
              {new Date(bike.bookedInfo[0]?.endDate).toLocaleDateString(
                "en-CA"
              ) || ""}
            </p>
          </>
        )}

        <div className="mt-4 space-y-2">
          {host ? (
            <>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded w-full"
                onClick={onDelete}
              >
                Delete Bike
              </button>
              <button
                className="bg-yellow-600 text-white px-4 py-2 rounded w-full"
                onClick={openUpdateModal}
              >
                Update Bike
              </button>
            </>
          ) : (
            <>
              {!returnMode && (
                <>
                  {!bike.booked ? (
                    <>
                      <button
                        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowModal(true);
                        }}
                      >
                        Rent Now
                      </button>
                      <button
                        className="bg-green-100 text-black px-4 py-2 rounded w-full"
                        onClick={() => {
                          fetchReviews(bike.bikeID);
                          setShowReviewModal(true);
                        }}
                      >
                        View Reviews & Ratings
                      </button>
                    </>
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

      {/* Extend Rental Modal */}
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
              Extend Rental for "{bike.bikeDetails?.bikeNumber}"
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

      {/* Rent Bike Modal */}
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
              <input
                type="number"
                name="depositAmount"
                placeholder="Deposit Amount"
                value={formData.depositAmount}
                onChange={handleInputChange}
                required
                min={1}
                step="0.01"
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

      {/* Reviews & Ratings Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 bg-gray-100 border-b sticky top-0 z-10">
              <h2 className="text-xl font-bold text-gray-800">
                Reviews & Ratings for "{bike.bikeNumber}"
              </h2>
              <button
                className="text-gray-400 hover:text-red-500 text-2xl font-bold"
                onClick={() => setShowReviewModal(false)}
              >
                &times;
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {loadingReviews ? (
                <p className="text-gray-500 text-center py-6">
                  Loading reviews...
                </p>
              ) : reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border rounded-xl shadow-sm p-4 bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 font-semibold">
                        {review.customerName?.[0] || "?"}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">
                        – {review.customerName}
                      </p>
                      <p className="mt-1 font-semibold text-yellow-500">
                        {"⭐".repeat(review.rating)}{" "}
                        <span className="text-gray-400">/ 5</span>
                      </p>
                      <p className="text-gray-700 mt-2">{review.comment}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-6">
                  No reviews yet.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Update Bike Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative max-h-[90vh] overflow-auto">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
              onClick={() => setShowUpdateModal(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Update Bike</h2>
            <form className="space-y-4" onSubmit={handleUpdateSubmit}>
              <input
                type="text"
                name="hostID"
                value={updateData.hostID}
                required
                className="w-full border rounded px-3 py-2"
                placeholder="Host ID"
              />
              <input
                type="text"
                name="bikeNumber"
                value={updateData.bikeNumber}
                onChange={handleUpdateInputChange}
                required
                className="w-full border rounded px-3 py-2"
                placeholder="Bike Number"
              />
              <input
                type="text"
                name="type"
                value={updateData.type}
                onChange={handleUpdateInputChange}
                required
                className="w-full border rounded px-3 py-2"
                placeholder="Bike Type"
              />
              <input
                type="text"
                name="address"
                value={updateData.address}
                onChange={handleUpdateInputChange}
                required
                className="w-full border rounded px-3 py-2"
                placeholder="Address"
              />
              <input
                type="number"
                name="rentalPrice"
                value={updateData.rentalPrice}
                onChange={handleUpdateInputChange}
                required
                min={0}
                className="w-full border rounded px-3 py-2"
                placeholder="Rental Price"
              />
              <select
                name="availabilityStatus"
                value={updateData.availabilityStatus.toString()}
                onChange={handleUpdateInputChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="true">Available</option>
                <option value="false">Not Available</option>
              </select>
              <input
                type="file"
                name="image"
                onChange={handleImageChange}
                accept="image/*"
                className="w-full border rounded px-3 py-2"
              />
              {updateData.previewUrl && (
                <img
                  src={updateData.previewUrl}
                  alt="Preview"
                  className="w-[150px] h-[150px] object-cover rounded-md mt-2"
                />
              )}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                >
                  Update
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
