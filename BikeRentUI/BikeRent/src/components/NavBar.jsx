import React from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };
  return (
    <nav className="w-full bg-white z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="p-3 text-xl font-bold text-purple-700">
          Local Voyage Srilanka
        </div>

        <div
          className="cursor-pointer p-2"
          onClick={() => handleNavigation("/login")}
        >
          Login
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
