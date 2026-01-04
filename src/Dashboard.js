import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

function Dashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [runningAI, setRunningAI] = useState(null);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
    const interval = setInterval(fetchReports, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchReports = async () => {
    try {
      const res = await fetch(`${API_BASE}/reports`);
      const data = await res.json();
      setReports(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const runAI = async (id) => {
    setRunningAI(id);
    try {
      const res = await fetch(`${API_BASE}/reports/${id}/run-ai`, {
        method: "POST"
      });

      const data = await res.json();
      if (res.ok) {
        alert(`✅ ${data.message || "AI verification completed"}`);
      } else {
        alert(`❌ ${data.message || "AI verification failed"}`);
      }
      fetchReports();
    } catch (err) {
      alert("❌ AI verification failed. Please check if AI service is running.");
    }
    setRunningAI(null);
  };

  const updateStatus = async (id, status) => {
    try {
      await fetch(`${API_BASE}/reports/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      fetchReports();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "CRITICAL":
        return "#d32f2f";
      case "HIGH":
        return "#f57c00";
      case "MEDIUM":
        return "#fbc02d";
      case "LOW":
        return "#388e3c";
      default:
        return "#757575";
    }
  };

  const getTrustScoreColor = (score) => {
    if (!score) return "#757575";
    if (score >= 75) return "#388e3c";
    if (score >= 55) return "#fbc02d";
    return "#d32f2f";
  };

  const filteredReports = reports.filter((r) => {
    if (filter === "all") return true;
    if (filter === "pending") return r.ai_status === "PENDING";
    if (filter === "verified") return r.ai_status === "COMPLETED";
    if (filter === "failed") return r.ai_status === "FAILED";
    return true;
  });

  const getIssueIcon = (type) => {
    const icons = {
      pothole: "🕳️",
      road_block: "🚧",
      garbage: "🗑️",
      accident: "🚨",
      water_leak: "💧",
      fire: "🔥"
    };
    return icons[type] || "📋";
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>🛡️ Civic-Eye Dashboard</h1>
          <p>AI-Verified Citizen Reports - Authority Moderation Panel</p>
        </div>
        <button onClick={() => navigate("/")} className="back-btn">
          ← Back to Report
        </button>
      </header>

      <div className="dashboard-content">
        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{reports.length}</div>
            <div className="stat-label">Total Reports</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {reports.filter((r) => r.ai_status === "COMPLETED").length}
            </div>
            <div className="stat-label">AI Verified</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {reports.filter((r) => r.priority === "CRITICAL" || r.priority === "HIGH").length}
            </div>
            <div className="stat-label">High Priority</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {reports.filter((r) => r.status === "Resolved").length}
            </div>
            <div className="stat-label">Resolved</div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters">
          <button
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All ({reports.length})
          </button>
          <button
            className={`filter-btn ${filter === "pending" ? "active" : ""}`}
            onClick={() => setFilter("pending")}
          >
            Pending ({reports.filter((r) => r.ai_status === "PENDING").length})
          </button>
          <button
            className={`filter-btn ${filter === "verified" ? "active" : ""}`}
            onClick={() => setFilter("verified")}
          >
            Verified ({reports.filter((r) => r.ai_status === "COMPLETED").length})
          </button>
          <button
            className={`filter-btn ${filter === "failed" ? "active" : ""}`}
            onClick={() => setFilter("failed")}
          >
            Failed ({reports.filter((r) => r.ai_status === "FAILED").length})
          </button>
        </div>

        {/* Reports List */}
        {loading ? (
          <div className="loading">Loading reports...</div>
        ) : filteredReports.length === 0 ? (
          <div className="empty-state">
            <p>📭 No reports found</p>
          </div>
        ) : (
          <div className="reports-grid">
            {filteredReports.map((r) => (
              <div key={r._id} className="report-card">
                <div className="report-header">
                  <div className="report-type">
                    {getIssueIcon(r.issue_type)} {r.issue_type.replace("_", " ")}
                  </div>
                  <div
                    className="priority-badge"
                    style={{ backgroundColor: getPriorityColor(r.priority) }}
                  >
                    {r.priority || "UNKNOWN"}
                  </div>
                </div>

                {r.description && (
                  <p className="report-description">{r.description}</p>
                )}

                <div className="report-image">
                  <img
                    src={`${API_BASE}/uploads/${r.image_filename}`}
                    alt={r.issue_type}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300x200?text=Image+Not+Found";
                    }}
                  />
                </div>

                <div className="report-details">
                  <div className="detail-row">
                    <span className="detail-label">AI Status:</span>
                    <span className="detail-value">
                      {r.ai_status === "COMPLETED" && (
                        <span className="status-badge success">✅ Verified</span>
                      )}
                      {r.ai_status === "PENDING" && (
                        <span className="status-badge pending">⏳ Pending</span>
                      )}
                      {r.ai_status === "FAILED" && (
                        <span className="status-badge failed">❌ Failed</span>
                      )}
                    </span>
                  </div>

                  {r.trust_score !== null && (
                    <div className="detail-row">
                      <span className="detail-label">Trust Score:</span>
                      <span
                        className="detail-value trust-score"
                        style={{ color: getTrustScoreColor(r.trust_score) }}
                      >
                        {r.trust_score}/100
                      </span>
                    </div>
                  )}

                  {r.base_severity !== null && (
                    <div className="detail-row">
                      <span className="detail-label">Severity:</span>
                      <span className="detail-value">{r.base_severity}/100</span>
                    </div>
                  )}

                  {r.latitude && r.longitude && (
                    <div className="detail-row">
                      <span className="detail-label">Location:</span>
                      <span className="detail-value">
                        📍 {r.latitude.toFixed(4)}, {r.longitude.toFixed(4)}
                      </span>
                    </div>
                  )}

                  <div className="detail-row">
                    <span className="detail-label">Reported:</span>
                    <span className="detail-value">
                      {new Date(r.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="report-actions">
                  {r.ai_status === "PENDING" && (
                    <button
                      className="action-btn primary"
                      onClick={() => runAI(r._id)}
                      disabled={runningAI === r._id}
                    >
                      {runningAI === r._id ? "⏳ Running AI..." : "🤖 Run AI Verification"}
                    </button>
                  )}

                  {r.ai_status === "FAILED" && (
                    <button
                      className="action-btn primary"
                      onClick={() => runAI(r._id)}
                      disabled={runningAI === r._id}
                    >
                      {runningAI === r._id ? "⏳ Retrying..." : "🔄 Retry AI"}
                    </button>
                  )}

                  <select
                    className="status-select"
                    value={r.status}
                    onChange={(e) => updateStatus(r._id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
