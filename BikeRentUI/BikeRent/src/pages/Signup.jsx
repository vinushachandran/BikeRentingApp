import Swal from "sweetalert2";
import React, { useState } from "react";
import InputField from "../components/common/InputField";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignUpPage = () => {
  const [termCondition, setTermCondition] = useState(false);
  const [nationality, setNationality] = useState("");
  const countries = [
    "India",
    "United Kingdom",
    "United States",
    "Australia",
    "Canada",
    "Germany",
    "France",
    "China",
    "Japan",
    "Italy",
    "Spain",
    "Russia",
    "Brazil",
    "South Africa",
    "New Zealand",
    "Malaysia",
    "Singapore",
    "Thailand",
    "UAE",
    "Saudi Arabia",
    "Bangladesh",
    "Pakistan",
    "Nepal",
    "Mexico",
    "Argentina",
    "Netherlands",
    "Switzerland",
    "Sweden",
    "Norway",
    "Denmark",
  ];

  const handleNationalityChange = (event) => {
    setNationality(event.target.value);
  };
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    country: null,
    passportNo: null,
    emergencyNo: null,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.username) newErrors.username = "Full name is required";
    if (!formData.phoneNumber)
      newErrors.phoneNumber = "Phone number is required";
    if (formData.phoneNumber.length != 10)
      newErrors.phoneNumber = "Phone number must be a 10 digit";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!nationality) newErrors.nationality = "Nationality required";
    if (nationality == "Tourist") {
      if (!formData.passportNo)
        newErrors.passportNo = "Passpoert number is required";
      if (!formData.country) newErrors.country = "Country is required";
      if (!formData.emergencyNo)
        newErrors.emergencyNo = "Emergency number is required";
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      if (!termCondition) {
        Swal.fire({
          icon: "warning",
          title: "Terms & Conditions",
          text: "Please agree to our terms and conditions to continue.",
          confirmButtonColor: "#3085d6",
        });
        return;
      }

      console.log(formData);

      const userPayload = {
        username: formData.username,
        email: formData.email,
        passwordHash: formData.password,
        phoneNumber: formData.phoneNumber,
        role: nationality,
        touristCountry: formData.country,
        passportNumber: formData.passportNo,
        emergencyContactNumber: formData.emergencyNo,
      };

      try {
        const response = await axios.post(
          "https://localhost:7176/api/User",
          userPayload
        );

        if (response.data.success) {
          Swal.fire({
            icon: "success",
            title: "Account Created",
            text: "Your account has been created successfully!",
            confirmButtonColor: "#3085d6",
          }).then(() => {
            navigate("/login");
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Sign Up Failed",
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
        <div className="text-center text-2xl font-semibold uppercase py-3">
          Create Account
        </div>

        <InputField
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Enter your username"
          error={errors.username}
        />

        <InputField
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          error={errors.email}
        />

        <div className="mt-4">
          <label
            htmlFor="phone number"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Phone Number
          </label>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            type="text"
            name="phoneNumber"
            placeholder="0XXXXXXXXX"
            value={formData.phoneNumber}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d{0,10}$/.test(value)) {
                setFormData((prev) => ({ ...prev, phoneNumber: value }));
              }
            }}
            maxLength={10}
          />
          {errors.phoneNumber && (
            <div className="text-red-500 text-sm mt-1">
              {errors.phoneNumber}
            </div>
          )}
        </div>

        <div className="mt-4">
          <label
            htmlFor="nationality"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Select Nationality
          </label>
          <select
            name="role"
            value={nationality}
            onChange={handleNationalityChange}
            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">-- Select --</option>
            <option value="Tourist">Tourist</option>
            <option value="User">Sri Lankan</option>
          </select>
          {errors.nationality && (
            <div className="text-red-500 text-sm mt-1">
              {errors.nationality}
            </div>
          )}
        </div>
        {nationality == "Tourist" && (
          <>
            <div className="mt-4">
              <label
                htmlFor="country"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Select Country
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              >
                <option value="">-- Select Country --</option>
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.country && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.country}
                </div>
              )}
            </div>

            <div className="mt-4">
              <InputField
                label="Passport Number"
                name="passportNo"
                value={formData.passportNo}
                onChange={handleChange}
                placeholder="Enter your passport number"
                error={errors.passportNo}
              />
            </div>

            <div className="mt-4">
              <label
                htmlFor="phone number"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Emergency Contact Number
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                type="number"
                name="emergencyNo"
                placeholder="Emergency contact number"
                value={formData.emergencyNo}
                onChange={handleChange}
              />
              {errors.emergencyNo && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.emergencyNo}
                </div>
              )}
            </div>
          </>
        )}
        <div className="mt-4"></div>
        <InputField
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          error={errors.password}
        />

        <InputField
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
          error={errors.confirmPassword}
        />

        <div className="flex items-center justify-between mb-4 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={termCondition}
              onChange={(e) => setTermCondition(e.target.checked)}
              className="form-checkbox text-blue-600"
            />
            I agree to the term and condition
          </label>
        </div>

        <button
          type="submit"
          className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Sign Up
        </button>

        <p className="mt-4 text-sm text-center">
          Already have an account?
          <span
            className="text-blue-600 ml-1 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default SignUpPage;
