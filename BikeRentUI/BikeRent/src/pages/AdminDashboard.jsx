import React, { useEffect, useState } from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { FaEdit, FaTrash, FaDownload } from "react-icons/fa";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import axios from "axios";

const MySwal = withReactContent(Swal);

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("Users");
  const [bikes, setBikes] = useState([]);
  const [reviews, setReviews] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchUsers();
    fetchBikes();
    fetchReviews();
  }, []);

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

  const fetchBikes = async () => {
    try {
      const response = await axios.get("https://localhost:7176/api/bikes");
      if (response.data.success) {
        setBikes(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching bikes:", error);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        "https://localhost:7176/api/Review/getAllReviews"
      );
      if (response.data.success) {
        setReviews(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleEdit = (type, id) => {
    if (user.userId === id) {
      Swal.fire("Warning", "Admin account cannot be modified", "warning");
      return;
    }
  };

  const handleDelete = (type, id) => {
    if (type == "User") {
      if (user.userId === id) {
        Swal.fire(
          "Warning",
          "Delete prevent admin user cannot be delete",
          "warning"
        );
        return;
      }
      MySwal.fire({
        title: `Are you sure you want to delete this ${type}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          MySwal.fire(
            "Deleted!",
            `${type} with ID ${id} has been deleted.`,
            "success"
          );
        }
      });
    } else if (type == "Bike") {
      MySwal.fire({
        title: `Are you sure you want to delete this ${type}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          MySwal.fire(
            "Deleted!",
            `${type} with ID ${id} has been deleted.`,
            "success"
          );
        }
      });
    }
  };

  const downloadCSV = (data, filename) => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `${filename}.csv`);
  };

  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    role: "User",
  });

  const openAddUserModal = () => {
    setFormData({
      id: null,
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      role: "User",
    });
    setErrors({});
    setIsEditMode(false);
    setShowModal(true);
  };

  const openEditUserModal = (userObj) => {
    setFormData({
      id: userObj.id,
      username: userObj.username,
      email: userObj.email,
      password: userObj.password,
      confirmPassword: userObj.password,
      phoneNumber: userObj.phoneNumber || "",
      role: userObj.role || "User",
    });
    setErrors({});
    setIsEditMode(true);
    setShowModal(true);
  };

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!isEditMode || formData.password) {
      if (!formData.password) newErrors.password = "Password is required";
      if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        role: formData.role,
      };

      if (!isEditMode || formData.password) {
        payload.passwordHash = formData.password;
      }
      let pass;
      let response;
      if (isEditMode) {
        const formData2 = new FormData();
        formData2.append("LicenseImageFile", null);
        formData2.append("Username", formData.username);
        formData2.append("Email", formData.email);
        formData2.append("Role", formData.role);
        formData2.append("PhoneNumber", formData.phoneNumber);
        formData2.append("LicenseVerified", false);
        formData2.append("Password", formData.password);
        formData2.append("UserId", formData.id);

        response = await fetch(`https://localhost:7176/api/User/update`, {
          method: "PUT",
          body: formData2,
        });
        const result = await response.json();
        pass = result.success;
      } else {
        // Add new user
        response = await axios.post("https://localhost:7176/api/User", payload);
        pass = response.data.success;
      }

      console.log(pass);
      if (pass) {
        Swal.fire({
          icon: "success",
          title: isEditMode ? "User Updated" : "User Added",
          text: isEditMode
            ? "User updated successfully!"
            : "User added successfully!",
          confirmButtonColor: "#3085d6",
        });

        setShowModal(false);
        setFormData({
          id: null,
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          phoneNumber: "",
          role: "User",
        });
        setErrors({});
        setIsEditMode(false);
        fetchUsers();
      } else {
        Swal.fire({
          icon: "error",
          title: isEditMode ? "Update Failed" : "Add User Failed",
          text: response.data.message || "Something went wrong",
          confirmButtonColor: "#d33",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text:
          error.response?.data?.message ||
          "An unexpected error occurred. Please try again.",
      });
    }
  };

  const renderTable = () => {
    switch (activeTab) {
      case "Users":
        return (
          <>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Users</h2>
                <div className="flex gap-3">
                  <button
                    className="bg-blue-700 text-white px-4 py-2 rounded-md"
                    onClick={openAddUserModal}
                  >
                    Add User
                  </button>
                  <button
                    onClick={() => downloadCSV(users, "Users_Report")}
                    className="bg-amber-900 text-white px-4 py-2 rounded-lg hover:bg-amber-800 flex items-center gap-2 transition-colors duration-300"
                  >
                    <FaDownload className="text-lg" />
                    <span className="hidden sm:inline">Download CSV</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left text-gray-600">
                  <thead className="text-md uppercase bg-green-600 text-white">
                    <tr>
                      <th className="px-6 py-4 font-semibold tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-4 font-semibold tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-4 font-semibold tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-4 font-semibold tracking-wider text-center">
                        Licence verify
                      </th>
                      <th className="px-6 py-4 font-semibold tracking-wider text-center">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((user, index) => {
                      return (
                        <tr
                          key={user.id}
                          className={
                            index % 2 === 0
                              ? "bg-white"
                              : "bg-gray-50 hover:bg-gray-100 transition"
                          }
                        >
                          <td className="px-6 py-4">{user.username}</td>
                          <td className="px-6 py-4">{user.email}</td>
                          <td className="px-6 py-4 capitalize">{user.role}</td>
                          <td className="px-6 py-4 text-center">
                            <button
                              className={`px-2 py-1 rounded ${
                                user.licenseVerified
                                  ? "bg-green-500 text-white"
                                  : "bg-red-500 text-white"
                              }`}
                            >
                              {user.licenseVerified
                                ? "Verified"
                                : "Not Verified"}
                            </button>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex justify-center items-center space-x-4">
                              <button
                                onClick={() =>
                                  openEditUserModal({
                                    id: user.userId,
                                    username: user.username,
                                    email: user.email,
                                    phoneNumber: user.phoneNumber,
                                    role: user.role,
                                    password: user.password,
                                  })
                                }
                                className="text-blue-600 hover:text-blue-800 transition"
                                title="Edit"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() =>
                                  handleDelete("User", user.userId)
                                }
                                className="text-red-600 hover:text-red-800 transition"
                                title="Delete"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            {showModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
                  <button
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                    onClick={() => setShowModal(false)}
                    aria-label="Close"
                  >
                    &times;
                  </button>

                  <h2 className="text-xl font-semibold mb-4">
                    {!isEditMode ? "Add New User" : "Edit User"}
                  </h2>

                  <form onSubmit={handleSubmit}>
                    <input
                      type="text"
                      name="username"
                      placeholder="Username"
                      value={formData.username}
                      onChange={handleChange}
                      className={`border px-3 py-2 mb-2 w-full rounded ${
                        errors.username ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.username && (
                      <p className="text-red-500 text-sm mb-2">
                        {errors.username}
                      </p>
                    )}

                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`border px-3 py-2 mb-2 w-full rounded ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mb-2">
                        {errors.email}
                      </p>
                    )}

                    <input
                      type="text"
                      name="phoneNumber"
                      placeholder="Phone Number"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="border px-3 py-2 mb-4 w-full rounded border-gray-300"
                    />

                    <>
                      <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`border px-3 py-2 mb-2 w-full rounded ${
                          errors.password ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.password && (
                        <p className="text-red-500 text-sm mb-2">
                          {errors.password}
                        </p>
                      )}

                      <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`border px-3 py-2 mb-2 w-full rounded ${
                          errors.confirmPassword
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-sm mb-2">
                          {errors.confirmPassword}
                        </p>
                      )}
                    </>

                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    >
                      {isEditMode ? "Update User" : "Add User"}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </>
        );
      case "Bikes":
        return (
          <>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Bikes</h2>
                <button
                  onClick={() => downloadCSV(bikes, "Bikes_Report")}
                  className="bg-amber-900 text-white px-4 py-2 rounded-lg hover:bg-amber-800 flex items-center gap-2 transition-colors duration-300"
                >
                  <FaDownload className="text-lg" />
                  <span className="hidden sm:inline">Download CSV</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left text-gray-600">
                  <thead className="text-md uppercase bg-green-600 text-white">
                    <tr>
                      <th className="px-6 py-4 font-semibold tracking-wider">
                        Bike Number
                      </th>
                      <th className="px-6 py-4 font-semibold tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-4 font-semibold tracking-wider">
                        Address
                      </th>
                      <th className="px-6 py-4 font-semibold tracking-wider">
                        Rental Price
                      </th>
                      <th className="px-6 py-4 font-semibold tracking-wider">
                        Host Name
                      </th>
                      <th className="px-6 py-4 font-semibold tracking-wider">
                        Available
                      </th>
                      <th className="px-6 py-4 font-semibold tracking-wider text-center">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {bikes.map((bike, index) => {
                      const hostUser = users.find(
                        (u) => u.userId === bike.hostID
                      );

                      return (
                        <tr
                          key={bike.bikeID}
                          className={
                            index % 2 === 0
                              ? "bg-white"
                              : "bg-gray-50 hover:bg-gray-100 transition"
                          }
                        >
                          <td className="px-6 py-4">{bike.bikeNumber}</td>
                          <td className="px-6 py-4">{bike.type}</td>
                          <td className="px-6 py-4">{bike.address}</td>
                          <td className="px-6 py-4">${bike.rentalPrice}</td>
                          <td className="px-6 py-4">
                            {hostUser ? hostUser.username : "Unknown"}
                          </td>
                          <td className="px-6 py-4">
                            {bike.availabilityStatus ? "Yes" : "No"}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex justify-center items-center space-x-4">
                              <button
                                onClick={() => handleEdit("Bike", bike.bikeID)}
                                className="text-blue-600 hover:text-blue-800 transition"
                                title="Edit"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() =>
                                  handleDelete("Bike", bike.bikeID)
                                }
                                className="text-red-600 hover:text-red-800 transition"
                                title="Delete"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        );
      case "Reviews":
        return (
          <>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Reviews</h2>
                <button
                  onClick={() => downloadCSV(reviews, "Reviews_Report")}
                  className="bg-amber-900 text-white px-4 py-2 rounded-lg hover:bg-amber-800 flex items-center gap-2 transition-colors duration-300"
                >
                  <FaDownload className="text-lg" />
                  <span className="hidden sm:inline">Download CSV</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left text-gray-600">
                  <thead className="text-md uppercase bg-green-600 text-white">
                    <tr>
                      <th className="px-6 py-3 font-semibold tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 font-semibold tracking-wider">
                        Bike Number
                      </th>
                      <th className="px-6 py-3 font-semibold tracking-wider">
                        Rating
                      </th>
                      <th className="px-6 py-3 font-semibold tracking-wider">
                        Comment
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {reviews.map((review, index) => {
                      const customer = users.find(
                        (u) => u.userId === review.customerID
                      );
                      const bike = bikes.find(
                        (b) => b.bikeID === review.bikeID
                      );
                      return (
                        <tr
                          key={review.id}
                          className={
                            index % 2 === 0
                              ? "bg-white"
                              : "bg-gray-50 hover:bg-gray-100 transition"
                          }
                        >
                          <td className="px-6 py-4">
                            {customer ? customer.username : "UnknownUser"}
                          </td>
                          <td className="px-6 py-4">
                            {bike ? bike.bikeNumber : "UnknownUser"}
                          </td>
                          <td className="px-6 py-4">{review.rating}</td>
                          <td className="px-6 py-4">{review.comment}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <DashboardNavbar name={"Admin"} />
      <div className="min-h-screen p-6 max-w-6xl mx-auto">
        {/* Tabs */}
        <div className="flex space-x-4 justify-center mb-6">
          {["Users", "Bikes", "Reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-semibold rounded ${
                activeTab === tab
                  ? "bg-green-700 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">{renderTable()}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
