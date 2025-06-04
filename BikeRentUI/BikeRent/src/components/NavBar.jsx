import React from "react";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="w-full bg-white z-50 shadow">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div
          className="p-3 text-xl font-bold text-purple-700 cursor-pointer"
          onClick={() => handleNavigation("/")}
        >
          Local Voyage Srilanka{" "}
          {user.role === "User" ? <>- Host</> : <>- {user.role}</>}{" "}
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {user.role == "Admin" && (
                <div
                  className="text-gray-700 font-medium cursor-pointer"
                  onClick={() => handleNavigation("/admin-dashboard")}
                >
                  {user.role} Panel
                </div>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded "
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => handleNavigation("/login")}
              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
