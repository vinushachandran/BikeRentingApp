import React from "react";
import { useNavigate } from "react-router-dom";

const DashboardNavbar = ({ name }) => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <nav className="bg-gray-600 w-full">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div
          className="p-3 text-xl font-bold text-white cursor-pointer"
          onClick={() => handleNavigation("/")}
        >
          Local Voyage Srilanka{" "}
          {user.role === "User" ? <>- Host</> : <>- {user.role}</>}{" "}
        </div>

        <div
          className="cursor-pointer text-white font-bold"
          onClick={() => handleNavigation("/")}
        >
          Home
        </div>

        <div className="space-x-2 flex items-center text-white cursor-pointer">
          {name != "Admin" && (
            <>
              <div className="w-[30px] h-[30px] rounded-full bg-white flex justify-center items-center text-black font-bold cursor-default">
                {user.username?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="text-white cursor-default">
                Welcome back {user.username}
              </div>
            </>
          )}
          {user && (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
