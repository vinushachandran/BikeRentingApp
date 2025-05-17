import React, { useState } from "react";

const Feedback = () => {
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!feedback.trim()) {
      setError("Feedback is required");
      return;
    }

    setError("");
    console.log("Feedback submitted:", feedback);
    setFeedback("");
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Feedback</h2>

      <form
        className="w-full mx-auto p-2 bg-white shadow-md rounded-md"
        onSubmit={handleSubmit}
      >
        <div className="">
          <textarea
            name="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows="4"
            placeholder="Write your feedback..."
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              error ? "border-red-500" : "border-gray-300"
            }`}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        <button
          type="submit"
          className="w-[200px] bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>

      <div className="py-2">
        <div className="p-2 bg-white">Feedback#1</div>
      </div>
    </div>
  );
};

export default Feedback;
