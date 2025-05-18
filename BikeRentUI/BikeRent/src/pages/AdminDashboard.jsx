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
    console.log("useEffect triggered");
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
          `${type} with ID ${user.userId} has been deleted.`,
          "success"
        );
      }
    });
  };

  const downloadCSV = (data, filename) => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `${filename}.csv`);
  };

  const renderTable = () => {
    switch (activeTab) {
      case "Users":
        return (
          <>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Users</h2>
                <button
                  onClick={() => downloadCSV(users, "Users_Report")}
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
                        Name
                      </th>
                      <th className="px-6 py-4 font-semibold tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-4 font-semibold tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-4 font-semibold tracking-wider text-center">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((user, index) => (
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
                          <div className="flex justify-center items-center space-x-4">
                            <button
                              onClick={() => handleEdit("User", user.userId)}
                              className="text-blue-600 hover:text-blue-800 transition"
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDelete("User", user.userId)}
                              className="text-red-600 hover:text-red-800 transition"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
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
                      {/* <th className="px-6 py-4 font-semibold tracking-wider">
                        Bike ID
                      </th> */}
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
                      console.log("Bike:", bike, "Host User:", hostUser);
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
