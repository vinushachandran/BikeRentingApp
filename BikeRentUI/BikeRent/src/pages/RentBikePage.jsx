import React, { useEffect, useState } from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import BikeCard from "../components/BikeCard";
import ReturnBikeModal from "../components/ReturnBikeModal";
import axios from "axios";
import Swal from "sweetalert2";

const RentBikePage = () => {
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [rentedBikes, setRentedBikes] = useState([]);
  const [returnMode, setReturnMode] = useState(false);
  const [selectedReturnBike, setSelectedReturnBike] = useState(null);

  const [bikes, setBikes] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchBikes = async () => {
    try {
      const response = await axios.get("https://localhost:7176/api/bikes");
      if (response.data.success) {
        const availableBikes = response.data.data.filter(
          (bike) => bike.availabilityStatus && bike.hostID !== user.userId
        );
        setBikes(availableBikes);
      } else {
        console.warn("Failed to fetch bikes:", response.data.message);
      }
    } catch (error) {
      console.error("Caught error while fetching bikes:", error.message);
    }
  };

  const fetchRentedBikes = async () => {
    try {
      const response = await axios.get("https://localhost:7176/api/Booking");

      if (response.data.success) {
        const userBookings = response.data.data.filter(
          (booking) => booking.customerID === user.userId
        );
        const activeBookings = userBookings.filter(
          (booking) => booking.status !== "Returned"
        );

        const bikeDetailsPromises = activeBookings.map((booking) =>
          axios.get(`https://localhost:7176/api/bikes/${booking.bikeID}`)
        );

        const bikeDetailsResponses = await Promise.all(bikeDetailsPromises);

        const bookedWithBikeInfo = activeBookings.map((booking, index) => ({
          ...booking,
          bikeDetails: bikeDetailsResponses[index].data.data,
        }));

        setRentedBikes(bookedWithBikeInfo);
      } else {
        console.warn("Failed to fetch bookings:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching rented bikes:", error);
    }
  };

  useEffect(() => {
    fetchBikes();
    fetchRentedBikes();
  }, []);

  const filteredBikes =
    selectedLocation === "All"
      ? bikes
      : bikes.filter((bike) => bike.location === selectedLocation);

  const handleReturnToggle = () => {
    setReturnMode((prev) => !prev);
    setSelectedReturnBike(null);
  };

  const handleBikeReturnClick = (bike) => {
    const foundBike = rentedBikes.find((b) => b.id === bike.id);
    setSelectedReturnBike(foundBike);
  };

  const handleConfirmReturn = (bikeId) => {
    setRentedBikes((prev) => prev.filter((bike) => bike.id !== bikeId));
    setSelectedReturnBike(null);
  };

  const bikesToDisplay = returnMode ? rentedBikes : filteredBikes;
  const uniqueLocations = ["All", ...new Set(bikes.map((b) => b.location))];

  const [licenseFile, setLicenseFile] = useState(null);
  const [licensePreviewUrl, setLicensePreviewUrl] = useState(null);
  const [licenseError, setLicenseError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLicenseFile(file);
      setLicensePreviewUrl(URL.createObjectURL(file));
      setLicenseError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!licenseFile) {
      Swal.fire({
        icon: "warning",
        title: "No File Selected",
        text: "Please select a license image before uploading.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("LicenseImageFile", licenseFile);
    formData.append("Username", user.username);
    formData.append("Email", user.email);
    formData.append("Role", user.role);
    formData.append("PhoneNumber", user.phoneNumber);
    formData.append("LicenseVerified", user.licenseVerified);
    formData.append("Password", user.password);
    formData.append("UserId", user.userId);
    try {
      const response = await fetch(`https://localhost:7176/api/user/update`, {
        method: "PUT",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setLicenseFile(null);
        Swal.fire({
          icon: "success",
          title: "Uploaded!",
          text: "License uploaded successfully.",
          confirmButtonColor: "#8B5CF6",
        });
        setShowModal(false);
      } else {
        Swal.fire({
          icon: "error",
          title: "Upload Failed",
          text: result.message || "Something went wrong.",
        });
      }
    } catch (error) {
      console.error("Upload error", error);
      Swal.fire({
        icon: "error",
        title: "Upload Error",
        text: "An unexpected error occurred during upload.",
      });
    }
  };

  return (
    <div>
      <DashboardNavbar name={"Renter"} />
      <div className="p-4 my-4 max-w-6xl mx-auto">
        <div className="flex justify-end my-2">
          {!user.licenseImage && (
            <>
              <button
                className="bg-purple-500 p-2 rounded-lg text-white"
                onClick={() => setShowModal(true)}
              >
                Add licence
              </button>
            </>
          )}

          {showModal && (
            <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex justify-center items-center z-50 border">
              <div className="bg-white p-6 rounded-lg w-full max-w-md relative border">
                <button
                  className="absolute top-2 right-2 text-gray-600 text-xl hover:text-red-600"
                  onClick={() => setShowModal(false)}
                >
                  &times;
                </button>
                <h2 className="text-lg font-semibold mb-4">
                  Upload Your License
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label
                      htmlFor="licenseUpload"
                      className={`block w-full bg-gray-200 text-gray-700 py-2 px-4 text-center rounded cursor-pointer hover:bg-gray-300 ${
                        licenseError ? "border border-red-500" : ""
                      }`}
                    >
                      {licenseFile
                        ? "Change License Image"
                        : "Choose License Image"}
                    </label>
                    <input
                      id="licenseUpload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    {licenseError && (
                      <p className="text-red-500 text-sm mt-1">
                        {licenseError}
                      </p>
                    )}
                  </div>

                  {/* Image Preview */}
                  {licensePreviewUrl && (
                    <img
                      src={licensePreviewUrl}
                      alt="License Preview"
                      className="w-full h-40 object-fill rounded-md mb-4"
                    />
                  )}
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      className="bg-gray-400 text-white px-4 py-2 rounded"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-purple-600 text-white px-4 py-2 rounded"
                    >
                      Upload
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center mb-4">
          {!returnMode ? (
            <>
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
            </>
          ) : (
            <>
              <div></div>
            </>
          )}
          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={handleReturnToggle}
          >
            {returnMode ? "Back to Rent" : "Return Bike"}
          </button>
        </div>

        {bikesToDisplay.length === 0 ? (
          <div className="text-center text-gray-500 mt-10 text-xl">
            {returnMode
              ? "You haven't rented any bikes."
              : "No bikes available."}
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {bikesToDisplay.map((bike) => (
              <BikeCard
                key={bike.bikeID}
                bike={bike}
                returnMode={returnMode}
                onReturnClick={handleBikeReturnClick}
                refreshRentBike={fetchRentedBikes}
              />
            ))}
          </div>
        )}
      </div>

      {selectedReturnBike && (
        <ReturnBikeModal
          bike={selectedReturnBike}
          onClose={() => setSelectedReturnBike(null)}
          onConfirmReturn={handleConfirmReturn}
          refresh={fetchRentedBikes}
        />
      )}
    </div>
  );
};

export default RentBikePage;
