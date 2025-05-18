import React, { useEffect, useState } from "react";
import BikeCard from "../components/BikeCard";
import DashboardNavbar from "../components/DashboardNavbar";
import Swal from "sweetalert2";
import axios from "axios";

const HostBikePage = () => {
  const [bikeData, setBikeData] = useState({
    bikeNumber: "",
    type: "",
    address: "",
    rentalPrice: "",
    availabilityStatus: "true",
    image: null,
    previewUrl: null,
  });

  const [hostedBikes, setHostedBikes] = useState([]);
  const [errors, setErrors] = useState({});
  const [showForm, setShowForm] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchBikes();
  }, []);

  const fetchBikes = async () => {
    try {
      const response = await axios.get("https://localhost:7176/api/bikes");
      const apiBikes = response.data.data || [];

      const userHostedBikes = apiBikes.filter(
        (bike) => bike.hostID === user.userId
      );

      setHostedBikes(userHostedBikes);
    } catch (error) {
      console.error("Failed to fetch bikes:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBikeData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBikeData((prev) => ({
        ...prev,
        image: file,
        previewUrl: URL.createObjectURL(file),
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!bikeData.bikeNumber.trim())
      newErrors.bikeNumber = "Bike number is required";
    if (!bikeData.type.trim()) newErrors.type = "Bike type is required";
    if (!bikeData.address.trim()) newErrors.address = "Address is required";
    if (!bikeData.rentalPrice || parseFloat(bikeData.rentalPrice) <= 0)
      newErrors.rentalPrice = "Rental price must be greater than 0";
    if (!bikeData.image) newErrors.image = "Please select an image";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("BikeNumber", bikeData.bikeNumber);
    formData.append("Type", bikeData.type);
    formData.append("Address", bikeData.address);
    formData.append("RentalPrice", bikeData.rentalPrice);
    formData.append("AvailabilityStatus", bikeData.availabilityStatus);
    formData.append("HostID", user.userId);
    formData.append("ImageFile", bikeData.image);

    try {
      const response = await fetch("https://localhost:7176/api/bikes/add", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        fetchBikes();
        setBikeData({
          bikeNumber: "",
          type: "",
          address: "",
          rentalPrice: "",
          availabilityStatus: "true",
          image: null,
          previewUrl: null,
        });

        setErrors({});
        setShowForm(false);
        Swal.fire({
          icon: "success",
          title: "Bike Hosted",
          text: "Bike was successfully added!",
          confirmButtonColor: "#3085d6",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed to Add Bike",
          text: (result.message || []).join(", "),
          confirmButtonColor: "#d33",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text:
          error?.response?.data?.message?.join(", ") || "Something went wrong!",
      });
    }
  };

  const handleDeleteBike = async (bikeId) => {
    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirmResult.isConfirmed) return;

    try {
      const response = await axios.delete(
        `https://localhost:7176/api/bikes/delete/${bikeId}`
      );

      console.log(response);

      if (response.data.success) {
        Swal.fire("Deleted!", "The bike has been removed.", "success");
        fetchBikes();
      } else {
        Swal.fire(
          "Failed",
          response.data.message || "Could not delete the bike.",
          "error"
        );
      }
    } catch (error) {
      console.log(error.response.data.message);
      Swal.fire("Error", "" + error.response.data.message, "error");
    }
  };

  const inputBase = "w-full border rounded px-3 py-2";
  const errorStyle = "border-red-500";

  return (
    <>
      <DashboardNavbar name={"Host"} />
      <div className="min-h-screen bg-gray-100 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Bikes list */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-boldtext-center font-semibold">
              My Hosted Bikes
            </h2>
            <button
              onClick={() => setShowForm(true)}
              className="bg-green-600 text-white px-6 py-2  rounded hover:bg-green-700"
            >
              Host a Bike
            </button>
          </div>

          <div className="py-3">
            {hostedBikes.length === 0 ? (
              <p className="text-center text-gray-500">No bikes hosted yet.</p>
            ) : (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {hostedBikes.map((bike) => (
                  <BikeCard
                    key={bike.id}
                    bike={bike}
                    host={true}
                    onDelete={() => handleDeleteBike(bike.bikeID)}
                  />
                ))}
              </div>
            )}
          </div>

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
                      name="bikeNumber"
                      placeholder="Bike Number"
                      value={bikeData.bikeNumber}
                      onChange={handleChange}
                      className={`${inputBase} ${
                        errors.bikeNumber ? errorStyle : ""
                      }`}
                    />
                    {errors.bikeNumber && (
                      <p className="text-red-500 text-sm">
                        {errors.bikeNumber}
                      </p>
                    )}
                  </div>

                  {/* Type */}
                  <div>
                    <select
                      name="type"
                      value={bikeData.type}
                      onChange={handleChange}
                      className={`${inputBase} ${
                        errors.type ? errorStyle : ""
                      }`}
                    >
                      <option value="">Select Bike Type</option>
                      <option value="Standard">Standard</option>
                      <option value="Electric">Electric</option>
                      <option value="Mountain">Mountain</option>
                      <option value="Scooter">Scooter</option>
                    </select>
                    {errors.type && (
                      <p className="text-red-500 text-sm">{errors.type}</p>
                    )}
                  </div>

                  {/* Address */}
                  <div>
                    <textarea
                      name="address"
                      placeholder="Address"
                      value={bikeData.address}
                      onChange={handleChange}
                      className={`${inputBase} ${
                        errors.address ? errorStyle : ""
                      }`}
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm">{errors.address}</p>
                    )}
                  </div>

                  {/* Rental Price */}
                  <div>
                    <input
                      type="number"
                      name="rentalPrice"
                      placeholder="Rental Price ($)"
                      value={bikeData.rentalPrice}
                      onChange={handleChange}
                      className={`${inputBase} ${
                        errors.rentalPrice ? errorStyle : ""
                      }`}
                    />
                    {errors.rentalPrice && (
                      <p className="text-red-500 text-sm">
                        {errors.rentalPrice}
                      </p>
                    )}
                  </div>

                  {/* Availability Status */}
                  <div>
                    <select
                      name="availabilityStatus"
                      value={bikeData.availabilityStatus}
                      onChange={handleChange}
                      className={inputBase}
                    >
                      <option value="true">Available</option>
                      <option value="false">Not Available</option>
                    </select>
                  </div>

                  {/* Image Upload */}
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

                  {/* Preview */}
                  {bikeData.previewUrl && (
                    <img
                      src={bikeData.previewUrl}
                      alt="Preview"
                      className="w-full h-40 object-fill rounded-md"
                    />
                  )}

                  {/* Buttons */}
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
