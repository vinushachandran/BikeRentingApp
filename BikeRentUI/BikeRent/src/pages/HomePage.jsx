import React from "react";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div>
      <NavBar />
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="block md:grid md:grid-cols-4 py-10 w-full max-w-7xl">
          <div className="col-span-2 flex items-center p-6">
            <div className="">
              <h1 className="capitalize text-5xl font-semibold">
                Make your ride easy & affordable
              </h1>
              <p className="text-gray-400 py-4">
                Embark on a journey through Sri Lanka's culture with authentic
                experiences and effortless bike rentals. Your adventure starts
                now
              </p>
              <div className="flex items-center font-bold py-3 flex-wrap gap-3">
                <button
                  className="cursor-pointer p-2 px-5 rounded-3xl bg-red-500 text-white mr-5"
                  onClick={() => handleNavigation("/rent-bike")}
                >
                  Start your Journey
                </button>
                <button
                  className="cursor-pointer p-2 px-5 rounded-3xl bg-black text-white"
                  onClick={() => handleNavigation("/host-bike")}
                >
                  Host Now
                </button>
              </div>
            </div>
          </div>
          <div className="col-span-2 flex justify-center items-center">
            <div className="h-[300px] w-[300px]">
              <img className="object-fill" src="./src/assets/dio.png" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
