import React, { useState } from "react";
import Swal from "sweetalert2";

const ReturnBikeModal = ({ bike, onClose, onConfirmReturn, refresh }) => {
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  const imageSrc = bike.bikeDetails.image
    ? `data:image/jpeg;base64,${bike.bikeDetails.image}`
    : "/placeholder-bike.jpg";

  const handleConfirm = async () => {
    if (!rating) {
      Swal.fire({
        icon: "warning",
        title: "Rating Required",
        text: "Please provide a rating before confirming return.",
      });
      return;
    }

    setLoading(true);

    try {
      const reviewPayload = {
        customerID: user.userId,
        bikeID: bike.bikeID,
        rating: parseInt(rating),
        comment: comment,
      };

      const reviewRes = await fetch("https://localhost:7176/api/Review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewPayload),
      });

      if (!reviewRes.ok) {
        throw new Error("Failed to submit review");
      }

      const updatedBooking = {
        bookingID: bike.bookingID,
        customerID: bike.customerID,
        bikeID: bike.bikeID,
        startDate: bike.startDate,
        endDate: new Date().toISOString(),
        status: "Returned",
      };

      const bookingRes = await fetch(
        `https://localhost:7176/api/Booking/${bike.bookingID}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedBooking),
        }
      );

      if (!bookingRes.ok) {
        throw new Error("Failed to update booking");
      }

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Bike returned and review submitted successfully.",
      });
      refresh();
      onConfirmReturn();
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong while returning the bike.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
      <div className="bg-white p-6 rounded-lg shadow-md min-w-sm">
        <h2 className="text-xl font-semibold mb-4">Return Bike</h2>
        <img
          src={imageSrc}
          alt={bike.bikeDetails.name}
          className="w-full h-40 object-fill rounded mb-4"
        />
        <p>
          <strong>Bike Number: {bike.bikeDetails.bikeNumber}</strong>
        </p>
        <p>Location: {bike.bikeDetails.address}</p>
        <p>Rent: Rs.{bike.bikeDetails.rentalPrice}/Day</p>

        {/* Rating input */}
        <div className="mt-4">
          <label className="block mb-1 font-semibold" htmlFor="rating">
            Rating <span className="text-red-600">*</span>
          </label>
          <select
            id="rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={loading}
          >
            <option value="">Select rating</option>
            {[1, 2, 3, 4, 5].map((star) => (
              <option key={star} value={star}>
                {star} {star === 1 ? "star" : "stars"}
              </option>
            ))}
          </select>
        </div>

        {/* Comment input */}
        <div className="mt-4">
          <label className="block mb-1 font-semibold" htmlFor="comment">
            Comment
          </label>
          <textarea
            id="comment"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your comments here..."
            className="w-full border border-gray-300 rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={loading}
          />
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "Processing..." : "Confirm Return"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReturnBikeModal;
