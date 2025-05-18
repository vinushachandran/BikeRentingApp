import React from "react";
import { useNavigate } from "react-router-dom";

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const handleNavigation = (path) => {
    navigate(path);
  };
  return (
    <div className="text-center mt-20 text-red-600 text-xl">
      <p className="">
        Unauthorized Access - You don’t have permission to view this page.
      </p>
      <button
        className="p-2 m-2 bg-blue-700 text-white rounded-lg"
        onClick={() => handleNavigation("/")}
      >
        Back to home
      </button>
    </div>
  );
};

export default UnauthorizedPage;
