import React, { useEffect, useState } from "react";

const BACKEND_URL = "https://civic-eye-backend-tnsa.onrender.com";

function App() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load reports from backend
  const loadReports = () => {
    fetch(`${BACKEND_URL}/reports`)
      .then((res) => res.json())
      .then((data) => {
        setReports(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching reports:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadReports();
  }, []);

  // Update report status
  const updateStatus = (id, status) => {
    fetch(`${BACKEND_URL}/reports/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status })
    })
      .then((res) => res.json())
      .then(() => {
        loadReports();
      })
      .catch((err) => {
        console.error("Error updating status:", err);
      });
  };

  return (
    <div style={{ padding: "24px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ marginBottom: "4px" }}>Civic-Eye Moderation Dashboard</h1>
      <p style={{ color: "#555", marginBottom: "20px" }}>
        AI-verified civic issue reports for authority action
      </p>

      {loading ? (
        <p>Loading reports...</p>
      ) : reports.length === 0 ? (
        <p>No reports available.</p>
      ) : (
        <table
          width="100%"
          cellPadding="10"
          style={{ borderCollapse: "collapse" }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f3f3f3" }}>
              <th align="left">Issue</th>
              <th align="left">Trust</th>
              <th align="left">Priority</th>
              <th align="left">Status</th>
              <th align="left">Action</th>
              <th align="left">Reported At</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr
                key={r._id}
                style={{ borderBottom: "1px solid #ddd" }}
              >
                <td>{r.issue_type}</td>
                <td>{r.trust_score}</td>
                <td>
                  <b>{r.priority}</b>
                </td>
                <td>{r.status}</td>
                <td>
                  <select
                    value={r.status}
                    onChange={(e) =>
                      updateStatus(r._id, e.target.value)
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </td>
                <td>
                  {new Date(r.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
