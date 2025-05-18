import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const BikeForm = ({ user, selectedBike, fetchBikes, setShowBikeForm }) => {
  const [bikeData, setBikeData] = useState({
    bikeID: 0,
    bikeNumber: "",
    hostId: "",
    type: "",
    address: "",
    rentalPrice: "",
    availabilityStatus: "true",
    image: null,
    previewUrl: null,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedBike) {
      setBikeData({
        bikeID: selectedBike.bikeID,
        bikeNumber: selectedBike.bikeNumber,
        hostId: selectedBike.hostID?.toString() || "",
        type: selectedBike.type,
        address: selectedBike.address,
        rentalPrice: selectedBike.rentalPrice,
        availabilityStatus: selectedBike.availabilityStatus.toString(),
        image: null,
        previewUrl: selectedBike.imageUrl || null,
      });
    }
  }, [selectedBike]);

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
    if (!bikeData.hostId) newErrors.hostId = "Please select a host";

    if (!bikeData.type.trim()) newErrors.type = "Bike type is required";
    if (!bikeData.address.trim()) newErrors.address = "Address is required";
    if (!bikeData.rentalPrice || parseFloat(bikeData.rentalPrice) <= 0)
      newErrors.rentalPrice = "Rental price must be greater than 0";
    if (!bikeData.image && !selectedBike)
      newErrors.image = "Please select an image";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("BikeID", bikeData.bikeID || 0);
    formData.append("HostID", bikeData.hostId);
    formData.append("BikeNumber", bikeData.bikeNumber);
    formData.append("Type", bikeData.type);
    formData.append("Address", bikeData.address);
    formData.append("RentalPrice", bikeData.rentalPrice);
    formData.append("AvailabilityStatus", bikeData.availabilityStatus);
    formData.append("HostID", user.userId);
    if (bikeData.image) formData.append("ImageFile", bikeData.image);

    try {
      const url = selectedBike
        ? "https://localhost:7176/api/bikes/update"
        : "https://localhost:7176/api/bikes/add";
      const method = selectedBike ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        fetchBikes();
        setShowBikeForm(false);
        Swal.fire({
          icon: "success",
          title: `Bike ${selectedBike ? "Updated" : "Added"}`,
          text: `Bike was successfully ${selectedBike ? "updated" : "added"}!`,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Operation Failed",
          text: (result.message || []).join(", "),
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: err.message || "Something went wrong!",
      });
    }
  };

  console.log(user);

  const inputBase = "w-full border rounded px-3 py-2";
  const errorStyle = "border-red-500";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded-lg shadow"
    >
      <div>
        <label className="block text-sm font-medium">Bike Number</label>
        <input
          type="text"
          name="bikeNumber"
          value={bikeData.bikeNumber}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
        {errors.bikeNumber && (
          <p className="text-red-500 text-sm">{errors.bikeNumber}</p>
        )}
      </div>

      <div>
        <select
          name="type"
          value={bikeData.type}
          onChange={handleChange}
          className={`${inputBase} ${errors.type ? errorStyle : ""}`}
        >
          <option value="">Select Bike Type</option>
          <option value="Standard">Standard</option>
          <option value="Electric">Electric</option>
          <option value="Mountain">Mountain</option>
          <option value="Scooter">Scooter</option>
        </select>
        {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Address</label>
        <input
          type="text"
          name="address"
          value={bikeData.address}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
        {errors.address && (
          <p className="text-red-500 text-sm">{errors.address}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Rental Price</label>
        <input
          type="number"
          name="rentalPrice"
          value={bikeData.rentalPrice}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
        {errors.rentalPrice && (
          <p className="text-red-500 text-sm">{errors.rentalPrice}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Host</label>
        <select
          name="hostId"
          value={bikeData.hostId}
          onChange={handleChange}
          className="w-full border rounded p-2"
        >
          <option value="">Select Host</option>
          {user.map((u) => (
            <option key={u.userId} value={u.userId}>
              {u.username}
            </option>
          ))}
        </select>
        {errors.hostId && (
          <p className="text-red-500 text-sm">{errors.hostId}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Available</label>
        <select
          name="availabilityStatus"
          value={bikeData.availabilityStatus}
          onChange={handleChange}
          className="w-full border rounded p-2"
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Bike Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {bikeData.previewUrl && (
          <div className="mt-3">
            <img
              src={bikeData.previewUrl}
              alt="Preview"
              className="h-40 w-full object-cover rounded-lg border border-gray-300 shadow-sm"
            />
          </div>
        )}

        {errors.image && (
          <p className="text-red-500 text-sm mt-1">{errors.image}</p>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {selectedBike ? "Update Bike" : "Add Bike"}
        </button>
        <button
          type="button"
          onClick={() => setShowBikeForm(false)}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default BikeForm;
