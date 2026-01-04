import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

function ReportPage() {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [issueType, setIssueType] = useState("pothole");
  const [description, setDescription] = useState("");
  const [pincode, setPincode] = useState("");
  const [address, setAddress] = useState("");
  const [userDate, setUserDate] = useState(new Date().toISOString().split("T")[0]);
  const [userTime, setUserTime] = useState(new Date().toTimeString().split(" ")[0].substring(0, 5));
  const [location, setLocation] = useState({ lat: null, lng: null, error: null });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [complaintId, setComplaintId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocation({ ...location, error: "Geolocation not supported" });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          error: null
        });
      },
      (error) => {
        setLocation({
          ...location,
          error: "Location access denied. You can still submit."
        });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setMessage("❌ Image size must be less than 10MB");
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!image) {
      setMessage("❌ Please select an image");
      return;
    }

    if (!pincode.trim()) {
      setMessage("❌ Pincode is required");
      return;
    }

    if (!address.trim()) {
      setMessage("❌ Address is required");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("image", image);
    formData.append("issue_type", issueType);
    formData.append("description", description);
    formData.append("pincode", pincode.trim());
    formData.append("address", address.trim());
    formData.append("user_date", userDate);
    formData.append("user_time", userTime);
    
    if (location.lat && location.lng) {
      formData.append("latitude", location.lat.toString());
      formData.append("longitude", location.lng.toString());
    }

    try {
      // Test backend connection first
      const healthCheck = await fetch(`${API_BASE}/health`);
      if (!healthCheck.ok) {
        setMessage("❌ Backend server is not responding. Please check if backend is running on port 5000.");
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_BASE}/api/reports`, {
        method: "POST",
        body: formData
      });

      // Check if response is JSON
      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        const text = await res.text();
        setMessage(`❌ Server error: ${text || "Invalid response from server"}`);
        setLoading(false);
        return;
      }

      if (res.ok) {
        setComplaintId(data.complaintId);
        setMessage(`✅ Report submitted successfully! Your Complaint ID: ${data.complaintId}`);
        
        // Reset form
        setImage(null);
        setImagePreview(null);
        setDescription("");
        setPincode("");
        setAddress("");
        
        // Redirect to track page after 3 seconds
        setTimeout(() => {
          navigate(`/track?complaintId=${data.complaintId}`);
        }, 3000);
      } else {
        setMessage(`❌ ${data.message || "Submission failed"}`);
      }
    } catch (err) {
      console.error("Submission error:", err);
      if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
        setMessage("❌ Cannot connect to backend. Please ensure:\n1. Backend is running (cd backend && npm start)\n2. Backend is on port 5000\n3. No firewall blocking the connection");
      } else {
        setMessage(`❌ Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🛡️ Civic-Eye</h1>
        <p className="subtitle">AI-Verified Citizen Journalism Portal</p>
        <p className="description">
          Report civic issues with photo proof. Our AI verifies authenticity automatically.
        </p>
      </header>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="report-form">
          {/* Image Upload */}
          <div className="form-group">
            <label className="form-label">📸 Upload Photo *</label>
            <div className="image-upload-area">
              {imagePreview ? (
                <div className="image-preview-container">
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                  <button
                    type="button"
                    onClick={() => {
                      setImage(null);
                      setImagePreview(null);
                    }}
                    className="remove-image-btn"
                  >
                    ✕ Remove
                  </button>
                </div>
              ) : (
                <label className="image-upload-label">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file-input"
                  />
                  <div className="upload-placeholder">
                    <span className="upload-icon">📷</span>
                    <span>Click to upload or drag and drop</span>
                    <span className="upload-hint">PNG, JPG up to 10MB</span>
                  </div>
                </label>
              )}
            </div>
          </div>

          {/* Date and Time */}
          <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group half" style={{ flex: 1 }}>
              <label className="form-label">📅 Date *</label>
              <input
                type="date"
                value={userDate}
                onChange={(e) => setUserDate(e.target.value)}
                className="form-input"
                required
              />
            </div>
            <div className="form-group half" style={{ flex: 1 }}>
              <label className="form-label">⏰ Time *</label>
              <input
                type="time"
                value={userTime}
                onChange={(e) => setUserTime(e.target.value)}
                className="form-input"
                required
              />
            </div>
          </div>

          {/* Issue Type */}
          <div className="form-group">
            <label className="form-label">⚠️ Issue Type *</label>
            <select
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
              className="form-select"
              required
            >
              <option value="pothole">🕳️ Pothole</option>
              <option value="road_block">🚧 Road Block</option>
              <option value="garbage">🗑️ Garbage</option>
              <option value="accident">🚨 Accident</option>
              <option value="water_leak">💧 Water Leak</option>
              <option value="fire">🔥 Fire</option>
              <option value="other">📋 Other</option>
            </select>
          </div>

          {/* Pincode */}
          <div className="form-group">
            <label className="form-label">📍 Pincode *</label>
            <input
              type="text"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              placeholder="Enter pincode"
              className="form-input"
              required
            />
          </div>

          {/* Address */}
          <div className="form-group">
            <label className="form-label">🏠 Full Address *</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter complete address"
              rows="3"
              className="form-textarea"
              required
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">📝 Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue in detail (optional but helpful for authorities)"
              rows="4"
              className="form-textarea"
            />
          </div>

          {/* Location */}
          <div className="form-group">
            <label className="form-label">📍 GPS Location</label>
            {location.lat && location.lng ? (
              <div className="location-status success">
                ✅ Location captured: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                <button
                  type="button"
                  onClick={getLocation}
                  className="refresh-location-btn"
                >
                  🔄 Refresh
                </button>
              </div>
            ) : (
              <div className="location-status">
                <span>{location.error || "Location not available"}</span>
                <button
                  type="button"
                  onClick={getLocation}
                  className="refresh-location-btn"
                >
                  📍 Get Location
                </button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !image}
            className="submit-btn"
          >
            {loading ? "⏳ Submitting..." : "🚀 Submit Report"}
          </button>

          {/* Message */}
          {message && (
            <div className={`message ${message.includes("✅") ? "success" : "error"}`}>
              {message}
            </div>
          )}
        </form>

        <div className="info-box">
          <h3>🔒 How It Works</h3>
          <ul>
            <li>📸 Upload a photo of the civic issue</li>
            <li>🤖 AI verifies image authenticity using ELA, metadata, and shadow analysis</li>
            <li>⭐ Each report gets a Trust Score</li>
            <li>📊 Authorities prioritize based on severity and trust</li>
          </ul>
          <button onClick={() => navigate("/track")} className="dashboard-link">
            📋 Track Existing Complaint
          </button>
          <button onClick={() => navigate("/dashboard")} className="dashboard-link">
            👨‍💼 Authority Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReportPage;
