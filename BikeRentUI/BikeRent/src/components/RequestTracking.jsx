import React, { useState } from "react";
import InputField from "./common/InputField";
import { FaEdit, FaRemoveFormat } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const RequestTracking = () => {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    fullName: "",
    experience: "",
    type: "",
    date: "",
    preference: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      console.log("Form Submitted:", formData);
      setErrors({});
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Experience type is required";
    }
    if (!formData.date) {
      newErrors.date = "Date is required";
    }
    if (!formData.preference.trim()) {
      newErrors.preference = "Preference is required";
    }
    return newErrors;
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-2">Create Request</h2>

      <form
        onSubmit={handleSubmit}
        className="w-full mx-auto p-6 bg-white shadow-md rounded-md"
      >
        {/* Experience */}
        <div className="mb-4">
          <InputField
            label="Experience Type"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter experience type"
            error={errors.fullName}
          />
        </div>

        {/* Date */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.date && (
            <p className="text-red-500 text-sm mt-1">{errors.date}</p>
          )}
        </div>

        {/* Preference */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Preference</label>
          <textarea
            name="Preference"
            value={formData.comments || ""}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.preference && (
            <p className="text-red-500 text-sm mt-1">{errors.preference}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-[200px] bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          Submit
        </button>
      </form>

      <div className="py-3">
        <h2 className="text-xl font-semibold mb-2">Request Tracking</h2>
        <div className="flex justify-between items-center rounded-md p-2 bg-white">
          <div className="">Request#1</div>
          <div className="">Pending</div>
          <div className="flex justify-center items-center">
            <button className="text-blue-900 p-2">
              <FaEdit size={20} />
            </button>
            <button className="text-red-600 p-2 ">
              <MdDelete size={20} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RequestTracking;
