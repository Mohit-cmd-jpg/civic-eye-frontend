import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

function TrackComplaint() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [complaintId, setComplaintId] = useState(searchParams.get("complaintId") || "");
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async (e) => {
    e.preventDefault();
    
    if (!complaintId.trim()) {
      setError("Please enter a Complaint ID");
      return;
    }

    setLoading(true);
    setError("");
    setComplaint(null);

    try {
      const res = await fetch(`${API_BASE}/api/reports/${complaintId.trim()}`);
      const data = await res.json();

      if (res.ok) {
        setComplaint(data);
      } else {
        setError(data.message || "Complaint not found");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-800";
      case "MEDIUM":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Track Complaint
            </h1>
            <p className="text-lg text-gray-600">
              Enter your Complaint ID to check status
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <form onSubmit={handleTrack} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Complaint ID
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={complaintId}
                    onChange={(e) => setComplaintId(e.target.value.toUpperCase())}
                    placeholder="CIV-1234567890-000001"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                  >
                    {loading ? "Searching..." : "Track"}
                  </button>
                </div>
              </div>
            </form>

            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-800 rounded-lg">
                {error}
              </div>
            )}
          </div>

          {/* Complaint Details */}
          {complaint && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Complaint Details
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Complaint ID
                    </label>
                    <p className="text-lg font-semibold text-gray-900">
                      {complaint.complaintId}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Issue Type
                    </label>
                    <p className="text-lg text-gray-900 capitalize">
                      {complaint.issue_type.replace("_", " ")}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Status
                  </label>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                      complaint.status
                    )}`}
                  >
                    {complaint.status}
                  </span>
                </div>

                {complaint.priority && complaint.priority !== "UNKNOWN" && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Priority
                    </label>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getPriorityColor(
                        complaint.priority
                      )}`}
                    >
                      {complaint.priority}
                    </span>
                  </div>
                )}

                {complaint.trust_score !== null && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Trust Score
                    </label>
                    <div className="mt-1">
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              complaint.trust_score >= 75
                                ? "bg-green-500"
                                : complaint.trust_score >= 50
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${complaint.trust_score}%` }}
                          />
                        </div>
                        <span className="ml-3 text-sm font-semibold text-gray-700">
                          {complaint.trust_score}/100
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Pincode
                  </label>
                  <p className="text-gray-900">{complaint.pincode}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Address
                  </label>
                  <p className="text-gray-900">{complaint.address}</p>
                </div>

                {complaint.description && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Description
                    </label>
                    <p className="text-gray-900">{complaint.description}</p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Submitted On
                  </label>
                  <p className="text-gray-900">
                    {new Date(complaint.created_at).toLocaleString()}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">
                    AI Verification Status
                  </label>
                  <p className="text-gray-900 capitalize">
                    {complaint.ai_status === "COMPLETED"
                      ? "✅ Verified"
                      : complaint.ai_status === "FAILED"
                      ? "❌ Failed"
                      : complaint.ai_status === "UNAVAILABLE"
                      ? "⚠️ Unavailable"
                      : "⏳ Pending"}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => navigate("/")}
                  className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition"
                >
                  Submit New Report
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TrackComplaint;

