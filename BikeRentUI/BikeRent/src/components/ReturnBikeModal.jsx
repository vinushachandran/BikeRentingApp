import React, { useState } from "react";

const ReturnBikeModal = ({ bike, onClose, onConfirmReturn }) => {
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");

  const handleConfirm = () => {
    if (!rating) {
      alert("Please provide a rating before confirming return.");
      return;
    }
    onConfirmReturn(bike.id, { rating, comment });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 ">
      <div className="bg-white p-6 rounded-lg shadow-md min-w-sm">
        <h2 className="text-xl font-semibold mb-4">Return Bike</h2>
        <img
          src="/src/assets/dio.png"
          alt={bike.name}
          className="w-full h-40 object-fill rounded mb-4"
        />
        <p>
          <strong>{bike.name}</strong>
        </p>
        <p>Location: {bike.location}</p>
        <p>Rent: ${bike.rent}/hour</p>

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
          />
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            onClick={handleConfirm}
          >
            Confirm Return
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReturnBikeModal;
