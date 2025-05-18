import Swal from "sweetalert2";
import React, { useState } from "react";
import InputField from "../components/common/InputField";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignUpPage = () => {
  const [termCondition, setTermCondition] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
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
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

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

      const userPayload = {
        username: formData.username,
        email: formData.email,
        passwordHash: formData.password,
        phoneNumber: formData.phoneNumber,
        role: "User",
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

        <InputField
          label="Phone Number"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="Enter your phone number"
        />

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
