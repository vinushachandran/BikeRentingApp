import React, { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const AdminAddUser = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    passwordHash: "",
    phoneNumber: "",
    role: "User", // default role, admin can change
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Basic validation
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.passwordHash) newErrors.passwordHash = "Password is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await axios.post(
          "https://localhost:7176/api/User",
          formData
        );

        if (response.data.success) {
          Swal.fire({
            icon: "success",
            title: "User Created",
            text: "New user has been added successfully!",
            confirmButtonColor: "#3085d6",
          });

          // Optionally clear form or redirect
          setFormData({
            username: "",
            email: "",
            passwordHash: "",
            phoneNumber: "",
            role: "User",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Creation Failed",
            text: response.data.message.join(", "),
            confirmButtonColor: "#d33",
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Server Error",
          text:
            error.response?.data?.message?.join(", ") ||
            "Something went wrong!",
        });
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[100vh] ">
      <form
        onSubmit={handleSubmit}
        className="min-w-md mx-auto px-6 p-6 bg-white rounded-md shadow-2xl border border-gray-200"
      >
        <h2 className="text-2xl font-semibold mb-6 uppercase text-center">
          Add New User
        </h2>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Enter username"
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Enter email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            name="passwordHash"
            value={formData.passwordHash}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Enter password"
          />
          {errors.passwordHash && (
            <p className="text-red-500 text-sm mt-1">{errors.passwordHash}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Enter phone number (optional)"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            {/* add more roles if needed */}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Add User
        </button>
      </form>
    </div>
  );
};

export default AdminAddUser;
