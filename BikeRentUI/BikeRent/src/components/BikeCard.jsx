import React, { useState } from "react";

const BikeCard = ({ bike, returnMode, onReturnClick }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", days: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `Thank you, ${formData.name}! You rented "${bike.name}" for ${formData.days} day(s).`
    );
    setFormData({ name: "", days: "" });
    setShowModal(false);
  };

  return (
    <>
      <div
        className={`border border-gray-300 shadow rounded-xl p-4 w-full max-w-full bg-white cursor-pointer hover:shadow-lg transition`}
      >
        <img
          src={bike.imageUrl || "./src/assets/dio.png"}
          alt={bike.name}
          className="w-full h-40 object-fill rounded-md mb-2"
        />
        <h3 className="text-xl font-semibold">{bike.name}</h3>
        <p className="text-sm text-gray-600">Location: {bike.location}</p>
        <p className="text-sm text-gray-600">Rent: ${bike.rent}/day</p>
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
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded w-full"
            onClick={() => returnMode && onReturnClick?.(bike)}
          >
            Return Bike
          </button>
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
            <h2 className="text-xl font-bold mb-4">Rent "{bike.name}"</h2>
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
