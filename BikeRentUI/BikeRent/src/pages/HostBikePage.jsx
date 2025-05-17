import React, { useState } from "react";
import BikeCard from "../components/BikeCard";
import DashboardNavbar from "../components/DashboardNavbar";

const HostBikePage = () => {
  const [bikeData, setBikeData] = useState({
    name: "",
    location: "",
    rent: "",
    image: null,
    previewUrl: null,
  });

  const [hostedBikes, setHostedBikes] = useState([]);
  const [errors, setErrors] = useState({});
  const [showForm, setShowForm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBikeData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBikeData((prev) => ({
        ...prev,
        image: file,
        previewUrl: URL.createObjectURL(file),
      }));
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!bikeData.name.trim()) newErrors.name = "Bike name is required";
    if (!bikeData.location.trim()) newErrors.location = "Location is required";
    if (!bikeData.rent || bikeData.rent <= 0)
      newErrors.rent = "Rent must be a positive number";
    if (!bikeData.image) newErrors.image = "Please select an image";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newBike = {
      id: Date.now(),
      name: bikeData.name,
      location: bikeData.location,
      rent: bikeData.rent,
      imageUrl: bikeData.previewUrl,
    };
    setHostedBikes((prev) => [...prev, newBike]);

    setBikeData({
      name: "",
      location: "",
      rent: "",
      image: null,
      previewUrl: null,
    });
    setShowForm(false);
  };

  const inputBase = "w-full border rounded px-3 py-2";
  const errorStyle = "border-red-500";

  return (
    <>
      <DashboardNavbar name={"Host"} />
      <div className="min-h-screen bg-gray-100 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Host a Bike
          </button>

          {/* Bikes list */}
          <h2 className="text-2xl font-bold mb-4 text-center">
            My Hosted Bikes
          </h2>
          {hostedBikes.length === 0 ? (
            <p className="text-center text-gray-500">No bikes hosted yet.</p>
          ) : (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {hostedBikes.map((bike) => (
                <BikeCard key={bike.id} bike={bike} />
              ))}
            </div>
          )}

          {/* Modal Overlay + Form */}
          {showForm && (
            <>
              <div
                onClick={() => setShowForm(false)}
                className="fixed inset-0  bg-white/10 backdrop-blur-sm z-40"
                aria-hidden="true"
              />
              <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
                <form
                  onSubmit={handleSubmit}
                  className="bg-white bg-opacity-70 backdrop-blur-md shadow-lg rounded-lg p-6 max-w-md w-full space-y-4 relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h2 className="text-2xl font-semibold text-center">
                    List Your Bike
                  </h2>

                  <div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Bike Name"
                      value={bikeData.name}
                      onChange={handleChange}
                      className={`${inputBase} ${
                        errors.name ? errorStyle : ""
                      }`}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <input
                      type="text"
                      name="location"
                      placeholder="Location"
                      value={bikeData.location}
                      onChange={handleChange}
                      className={`${inputBase} ${
                        errors.location ? errorStyle : ""
                      }`}
                    />
                    {errors.location && (
                      <p className="text-red-500 text-sm">{errors.location}</p>
                    )}
                  </div>

                  <div>
                    <input
                      type="number"
                      name="rent"
                      placeholder="Rent per Day ($)"
                      value={bikeData.rent}
                      onChange={handleChange}
                      className={`${inputBase} ${
                        errors.rent ? errorStyle : ""
                      }`}
                    />
                    {errors.rent && (
                      <p className="text-red-500 text-sm">{errors.rent}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="bikeImage"
                      className={`block w-full bg-gray-200 text-gray-700 py-2 px-4 text-center rounded cursor-pointer hover:bg-gray-300 ${
                        errors.image ? "border border-red-500" : ""
                      }`}
                    >
                      {bikeData.image ? "Change Image" : "Choose Bike Image"}
                    </label>
                    <input
                      id="bikeImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    {errors.image && (
                      <p className="text-red-500 text-sm">{errors.image}</p>
                    )}
                  </div>

                  {bikeData.previewUrl && (
                    <img
                      src={bikeData.previewUrl}
                      alt="Preview"
                      className="w-full h-40 object-fill rounded-md"
                    />
                  )}

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    >
                      Submit Bike
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="w-full bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default HostBikePage;
