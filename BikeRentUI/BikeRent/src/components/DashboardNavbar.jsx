import React from "react";

const DashboardNavbar = ({ name }) => {
  return (
    <nav className="bg-gray-600 w-full">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="p-3 text-xl font-bold text-white">
          Local Voyage Srilanka {name == "Admin" && <>- AdminDashboard</>}
        </div>

        <div className="space-x-2 hidden md:flex">
          <div className="w-[30px] h-[30px] rounded-full bg-white flex justify-center items-center">
            S
          </div>
          <div className="cursor-pointer text-white flex items-center justify-center">
            {name}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
