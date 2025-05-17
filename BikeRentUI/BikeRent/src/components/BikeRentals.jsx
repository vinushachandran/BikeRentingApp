import React from "react";

const BikeRentals = () => {
  return (
    <div className="py-3">
      <h2 className="text-xl font-semibold mb-2">Bike Rentals</h2>
      <div className="flex justify-between items-center rounded-md p-2 bg-white">
        <div className="">
          <div className="font-semibold">Bike#1</div>
          <div className="">Duration: 2 Days</div>
          <div className="">Pick up : location A</div>
          <div className="">Drop off : location B</div>
        </div>
        <div className="flex justify-center items-center">
          <button className="p-2 rounded-md bg-green-500 text-white">
            Returned
          </button>
        </div>
      </div>
    </div>
  );
};

export default BikeRentals;
