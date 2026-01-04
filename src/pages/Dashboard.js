import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Dashboard.css";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

function Dashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterPincode, setFilterPincode] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [verifying, setVerifying] = useState(null);
  const [authority, setAuthority] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const authData = localStorage.getItem("authority");
    
    if (!token) {
      navigate("/login");
      return;
    }

    if (authData) {
      setAuthority(JSON.parse(authData));
    }

    fetchReports();
    const interval = setInterval(fetchReports, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, [navigate]);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();
      
      if (filterPincode) params.append("pincode", filterPincode);
      if (filterStatus) params.append("status", filterStatus);
      if (filterPriority) params.append("priority", filterPriority);

      const res = await fetch(`${API_BASE}/api/reports?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (res.ok) {
        setReports(data.reports || []);
      }
    } catch (err) {
      console.error("Fetch reports error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (reportId) => {
    setVerifying(reportId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/reports/${reportId}/verify`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (res.ok) {
        alert(`✅ ${data.message}\nTrust Score: ${data.trust_score}\nPriority: ${data.priority}`);
        fetchReports();
      } else {
        alert(`❌ ${data.message}`);
      }
    } catch (err) {
      alert("❌ AI verification failed. Is the AI service running?");
    } finally {
      setVerifying(null);
    }
  };

  const handleStatusUpdate = async (reportId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/reports/${reportId}/status`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        fetchReports();
      }
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("authority");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div style={{ textAlign: "center", padding: "60px" }}>
          <p>Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>🛡️ Civic-Eye Dashboard</h1>
          <p>AI-Verified Citizen Reports - Authority Moderation Panel</p>
          {authority && (
            <p style={{ marginTop: "8px", fontSize: "0.9rem" }}>
              {authority.name} ({authority.role})
              {authority.assigned_pincodes.length > 0 && (
                <span> • Pincodes: {authority.assigned_pincodes.join(", ")}</span>
              )}
            </p>
          )}
        </div>
        <div>
          <button onClick={() => navigate("/")} className="back-btn" style={{ marginRight: "10px" }}>
            ← Home
          </button>
          <button onClick={handleLogout} className="back-btn">
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Filters */}
        <div style={{ background: "white", borderRadius: "12px", padding: "20px", marginBottom: "25px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", alignItems: "end" }}>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem", fontWeight: "500" }}>Pincode</label>
              <input
                type="text"
                value={filterPincode}
                onChange={(e) => setFilterPincode(e.target.value)}
                placeholder="Filter by pincode"
                style={{ width: "100%", padding: "8px 12px", border: "1px solid #ddd", borderRadius: "6px" }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem", fontWeight: "500" }}>Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{ width: "100%", padding: "8px 12px", border: "1px solid #ddd", borderRadius: "6px" }}
              >
                <option value="">All Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem", fontWeight: "500" }}>Priority</label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                style={{ width: "100%", padding: "8px 12px", border: "1px solid #ddd", borderRadius: "6px" }}
              >
                <option value="">All Priority</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
            <div>
              <button
                onClick={fetchReports}
                style={{ width: "100%", padding: "10px", background: "#667eea", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Reports Table */}
        <div style={{ background: "white", borderRadius: "12px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "#f8f9fa" }}>
              <tr>
                <th style={{ padding: "15px", textAlign: "left", borderBottom: "2px solid #e9ecef", fontSize: "0.85rem", fontWeight: "600", color: "#666" }}>Complaint ID</th>
                <th style={{ padding: "15px", textAlign: "left", borderBottom: "2px solid #e9ecef", fontSize: "0.85rem", fontWeight: "600", color: "#666" }}>Image</th>
                <th style={{ padding: "15px", textAlign: "left", borderBottom: "2px solid #e9ecef", fontSize: "0.85rem", fontWeight: "600", color: "#666" }}>Issue</th>
                <th style={{ padding: "15px", textAlign: "left", borderBottom: "2px solid #e9ecef", fontSize: "0.85rem", fontWeight: "600", color: "#666" }}>Pincode</th>
                <th style={{ padding: "15px", textAlign: "left", borderBottom: "2px solid #e9ecef", fontSize: "0.85rem", fontWeight: "600", color: "#666" }}>AI Status</th>
                <th style={{ padding: "15px", textAlign: "left", borderBottom: "2px solid #e9ecef", fontSize: "0.85rem", fontWeight: "600", color: "#666" }}>Trust Score</th>
                <th style={{ padding: "15px", textAlign: "left", borderBottom: "2px solid #e9ecef", fontSize: "0.85rem", fontWeight: "600", color: "#666" }}>Priority</th>
                <th style={{ padding: "15px", textAlign: "left", borderBottom: "2px solid #e9ecef", fontSize: "0.85rem", fontWeight: "600", color: "#666" }}>Status</th>
                <th style={{ padding: "15px", textAlign: "left", borderBottom: "2px solid #e9ecef", fontSize: "0.85rem", fontWeight: "600", color: "#666" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ padding: "40px", textAlign: "center", color: "#666" }}>
                    No reports found
                  </td>
                </tr>
              ) : (
                reports.map((report) => (
                  <tr key={report._id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                    <td style={{ padding: "15px", fontFamily: "monospace", fontSize: "0.85rem" }}>{report.complaintId}</td>
                    <td style={{ padding: "15px" }}>
                      <img
                        src={`${API_BASE}/uploads/${report.image_filename}`}
                        alt={report.issue_type}
                        style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "6px" }}
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/80?text=Image";
                        }}
                      />
                    </td>
                    <td style={{ padding: "15px" }}>
                      <div style={{ fontWeight: "500", textTransform: "capitalize" }}>{report.issue_type.replace("_", " ")}</div>
                      {report.description && (
                        <div style={{ fontSize: "0.85rem", color: "#666", marginTop: "4px", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {report.description}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "15px" }}>{report.pincode}</td>
                    <td style={{ padding: "15px" }}>
                      {report.ai_status === "COMPLETED" ? (
                        <span style={{ color: "#2e7d32", fontWeight: "500" }}>✅ Verified</span>
                      ) : report.ai_status === "FAILED" ? (
                        <span style={{ color: "#c62828", fontWeight: "500" }}>❌ Failed</span>
                      ) : report.ai_status === "UNAVAILABLE" ? (
                        <span style={{ color: "#666", fontWeight: "500" }}>⚠️ Unavailable</span>
                      ) : (
                        <span style={{ color: "#f57c00", fontWeight: "500" }}>⏳ Pending</span>
                      )}
                    </td>
                    <td style={{ padding: "15px" }}>
                      {report.trust_score !== null ? (
                        <span style={{ fontWeight: "600" }}>{report.trust_score}/100</span>
                      ) : (
                        <span style={{ color: "#999" }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: "15px" }}>
                      {report.priority && report.priority !== "UNKNOWN" ? (
                        <span
                          style={{
                            padding: "4px 10px",
                            borderRadius: "12px",
                            fontSize: "0.75rem",
                            fontWeight: "600",
                            background: report.priority === "HIGH" ? "#ffebee" : report.priority === "MEDIUM" ? "#fff3e0" : "#e8f5e9",
                            color: report.priority === "HIGH" ? "#c62828" : report.priority === "MEDIUM" ? "#f57c00" : "#2e7d32"
                          }}
                        >
                          {report.priority}
                        </span>
                      ) : (
                        <span style={{ color: "#999" }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: "15px" }}>
                      <select
                        value={report.status}
                        onChange={(e) => handleStatusUpdate(report._id, e.target.value)}
                        style={{
                          padding: "6px 10px",
                          border: "1px solid #ddd",
                          borderRadius: "6px",
                          fontSize: "0.85rem",
                          background: report.status === "Resolved" ? "#e8f5e9" : report.status === "In Progress" ? "#e3f2fd" : "#fff3e0",
                          color: report.status === "Resolved" ? "#2e7d32" : report.status === "In Progress" ? "#1976d2" : "#f57c00",
                          fontWeight: "500"
                        }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </td>
                    <td style={{ padding: "15px" }}>
                      {report.ai_status !== "COMPLETED" && (
                        <button
                          onClick={() => handleVerify(report._id)}
                          disabled={verifying === report._id}
                          style={{
                            padding: "6px 12px",
                            background: "#667eea",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: verifying === report._id ? "not-allowed" : "pointer",
                            opacity: verifying === report._id ? 0.6 : 1,
                            fontSize: "0.85rem"
                          }}
                        >
                          {verifying === report._id ? "Verifying..." : "Verify AI"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: "20px", textAlign: "center", color: "#666", fontSize: "0.9rem" }}>
          Showing {reports.length} report(s)
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
