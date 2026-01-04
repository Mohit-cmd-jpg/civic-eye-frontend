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
  const [showImageModal, setShowImageModal] = useState(false);

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

  const getStatusStep = (status) => {
    switch (status) {
      case "Pending": return 1;
      case "Verified": return 2;
      case "In Progress": return 3;
      case "Resolved": return 4;
      default: return 1;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-800 border-red-200";
      case "MEDIUM":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-green-100 text-green-800 border-green-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 pb-32 pt-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Track Your Complaint
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Stay updated with real-time status of your reported civic issues
            </p>
            
            {/* Search Bar */}
            <div className="bg-white rounded-xl shadow-xl p-2 max-w-2xl mx-auto transform translate-y-8">
              <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-2">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={complaintId}
                    onChange={(e) => setComplaintId(e.target.value.toUpperCase())}
                    placeholder="Enter Complaint ID (e.g., CIV-123...)"
                    className="w-full pl-10 pr-4 py-3 md:py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-8 py-3 md:py-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center justify-center min-w-[120px]"
                >
                  {loading ? (
                     <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                     </svg>
                  ) : "Track"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 pt-16 pb-20">
        <div className="max-w-3xl mx-auto">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-lg shadow-sm">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {complaint && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 animate-fade-in-up">
              {/* Status Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                <div>
                  <p className="text-sm text-gray-500">Complaint ID</p>
                  <p className="font-mono font-bold text-gray-900 text-lg">{complaint._id}</p>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${getPriorityColor(complaint.priority)}`}>
                  {complaint.priority} PRIORITY
                </span>
              </div>

              <div className="p-6 md:p-8">
                {/* Status Timeline */}
                <div className="mb-10 relative">
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                    <div style={{ width: `${(getStatusStep(complaint.status) / 4) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500 ease-out"></div>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm font-medium text-gray-600">
                    <div className={`flex flex-col items-center ${getStatusStep(complaint.status) >= 1 ? 'text-blue-600' : ''}`}>
                      <span>Submitted</span>
                    </div>
                    <div className={`flex flex-col items-center ${getStatusStep(complaint.status) >= 2 ? 'text-blue-600' : ''}`}>
                      <span>Verified</span>
                    </div>
                    <div className={`flex flex-col items-center ${getStatusStep(complaint.status) >= 3 ? 'text-blue-600' : ''}`}>
                      <span>In Progress</span>
                    </div>
                    <div className={`flex flex-col items-center ${getStatusStep(complaint.status) >= 4 ? 'text-green-600' : ''}`}>
                      <span>Resolved</span>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Issue Type</h3>
                      <div className="flex items-center text-gray-900 font-semibold text-lg capitalize">
                        <span className="p-2 bg-blue-50 rounded-lg mr-3 text-blue-600">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </span>
                        {complaint.issue_type}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Location</h3>
                      <div className="flex flex-col text-gray-900">
                        <div className="flex items-start mb-1">
                          <span className="p-2 bg-gray-50 rounded-lg mr-3 text-gray-600 mt-1">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </span>
                          <span className="mt-1.5">{complaint.address || "Address available"}</span>
                        </div>
                        {complaint.latitude && complaint.longitude && (
                          <div className="flex items-center ml-12 text-sm text-gray-500">
                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 7m0 13V7" />
                            </svg>
                            Coordinates: {complaint.latitude.toFixed(6)}, {complaint.longitude.toFixed(6)}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Date Reported</h3>
                      <div className="flex items-center text-gray-900">
                         <span className="p-2 bg-gray-50 rounded-lg mr-3 text-gray-600">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </span>
                        {complaint.user_date ? `${complaint.user_date} at ${complaint.user_time}` : new Date(complaint.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Image Section */}
                  <div className="relative h-64 md:h-full min-h-[250px] bg-gray-100 rounded-xl overflow-hidden border border-gray-200 group">
                    {complaint.image_url ? (
                      <>
                        <img 
                          src={`${API_BASE}${complaint.image_url}`} 
                          alt="Complaint Evidence" 
                          className="absolute inset-0 w-full h-full object-cover transition-transform hover:scale-105 duration-500 cursor-pointer"
                          onClick={() => setShowImageModal(true)}
                          onError={(e) => {
                            e.target.onerror = null; 
                            e.target.style.display = 'none';
                            e.target.parentElement.querySelector('.no-image-placeholder').style.display = 'flex';
                          }}
                        />
                        <div 
                          className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center cursor-pointer"
                          onClick={() => setShowImageModal(true)}
                        >
                          <span className="text-white opacity-0 group-hover:opacity-100 font-medium px-4 py-2 bg-black bg-opacity-50 rounded-lg backdrop-blur-sm transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                            View Photo
                          </span>
                        </div>
                        <div className="no-image-placeholder hidden absolute inset-0 flex items-center justify-center text-gray-400 flex-col bg-gray-100">
                           <svg className="w-12 h-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>Image failed to load</span>
                        </div>
                      </>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400 flex-col">
                        <svg className="w-12 h-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>No image available</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                {complaint.description && (
                  <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                    <p className="text-gray-700 leading-relaxed">{complaint.description}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="mt-12 text-center">
            <button 
                onClick={() => navigate('/')}
                className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center transition-colors"
            >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
            </button>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && complaint && complaint.image_url && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-90 animate-fade-in-up" onClick={() => setShowImageModal(false)}>
          <button 
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-50 p-2"
            onClick={() => setShowImageModal(false)}
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img 
            src={`${API_BASE}${complaint.image_url}`} 
            alt="Complaint Evidence Full" 
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

export default TrackComplaint;
