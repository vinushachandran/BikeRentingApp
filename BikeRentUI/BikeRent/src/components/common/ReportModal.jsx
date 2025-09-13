import React, { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const ReportModal = ({ onClose, user, rentedBikes, bikes }) => {
  const [reportType, setReportType] = useState("bike");
  const [selectedId, setSelectedId] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      Swal.fire("Warning", "Report message is required", "warning");
      return;
    }

    const reportData = {
      hostID: reportType === "host" ? Number(selectedId) : null,
      bikeID: reportType === "bike" ? Number(selectedId) : null,
      reportMessage: message,
    };

    console.log(reportData);

    try {
      const response = await axios.post(
        "https://localhost:7176/api/report",
        reportData
      );

      if (response.data.success) {
        Swal.fire("Success", "Report submitted successfully", "success");
        onClose();
      } else {
        Swal.fire(
          "Error",
          response.data.message || "Failed to submit report",
          "error"
        );
      }
    } catch (error) {
      Swal.fire("Error", "Unexpected error occurred", "error");
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4">Report an Issue</h2>

        <form onSubmit={handleSubmit}>
          {/* Report Type */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Report Type</label>
            <select
              className="border border-gray-300 rounded px-3 py-2 w-full"
              value={reportType}
              onChange={(e) => {
                setReportType(e.target.value);
                setSelectedId("");
              }}
            >
              <option value="bike">Bike</option>
              <option value="host">Host</option>
            </select>
          </div>

          {/* ID Selector */}
          <div className="mb-4">
            <label className="block font-medium mb-1">
              {reportType === "bike" ? "Select Bike" : "Select Host"}
            </label>
            <select
              className="border border-gray-300 rounded px-3 py-2 w-full"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              required
            >
              <option value="">-- Select --</option>
              {reportType === "bike"
                ? bikes.map((b) => (
                    <option key={b.bikeID} value={b.bikeID}>
                      {b.type} - {b.bikeNumber}
                    </option>
                  ))
                : rentedBikes.map((r) => (
                    <option
                      key={r.bikeDetails.hostID}
                      value={r.bikeDetails.hostID}
                    >
                      {r.bikeDetails.hostName} (Host of {r.bikeDetails.model})
                    </option>
                  ))}
              {reportType === "host"
                ? user.map((b) => (
                    <option key={b.userId} value={b.userId}>
                      {b.username}
                    </option>
                  ))
                : rentedBikes.map((r) => (
                    <option
                      key={r.bikeDetails.hostID}
                      value={r.bikeDetails.hostID}
                    >
                      {r.bikeDetails.hostName} (Host of {r.bikeDetails.model})
                    </option>
                  ))}
            </select>
          </div>

          {/* Report Message */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Message</label>
            <textarea
              className="border border-gray-300 rounded px-3 py-2 w-full"
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="bg-gray-400 text-white px-4 py-2 rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;
