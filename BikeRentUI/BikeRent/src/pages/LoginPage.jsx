import React, { useState } from "react";
import InputField from "../components/common/InputField";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setErrors({});
      console.log("Login submitted", { email, password });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[100vh]">
      <form
        onSubmit={handleLogin}
        className="min-w-md mx-auto p-4 bg-white rounded-md shadow-2xl border border-gray-200"
      >
        <div className="text-center text-2xl font-semibold uppercase py-3">
          Bike Rent
        </div>
        <InputField
          label="Email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          error={errors.email}
        />
        <InputField
          label="Password"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          error={errors.password}
        />

        <div className="flex items-center justify-between mb-4 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="form-checkbox text-blue-600"
            />
            Remember me
          </label>
          <div className="text-blue-600 cursor-pointer">Forgot password?</div>
        </div>

        <button
          type="submit"
          className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
        <p className="mt-4 text-sm text-center">
          Don't have an account?
          <span
            className="text-blue-600 ml-1 cursor-pointer"
            onClick={() => handleNavigation("/signup")}
          >
            Sign up
          </span>
        </p>

        <p className="text-xs text-gray-500 mt-4 text-center">
          By logging in, you agree to our{" "}
          <span className="text-blue-600">Term of Service</span> and{" "}
          <span className="text-blue-600">Privacy Policy</span>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
