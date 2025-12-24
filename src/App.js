import React, { useEffect, useState } from "react";

function App() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch reports
  const loadReports = () => {
    fetch("http://localhost:5000/reports")
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
    fetch(`http://localhost:5000/reports/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    })
      .then((res) => res.json())
      .then(() => {
        loadReports(); // refresh table
      })
      .catch((err) => {
        console.error("Error updating status:", err);
      });
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Civic-Eye Moderation Dashboard</h1>
      <p>Authorities can update report status in real time.</p>

      <hr />

      {loading ? (
        <p>Loading reports...</p>
      ) : reports.length === 0 ? (
        <p>No reports available.</p>
      ) : (
        <table border="1" cellPadding="8" width="100%">
          <thead>
            <tr>
              <th>Issue Type</th>
              <th>Trust</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Action</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r._id}>
                <td>{r.issue_type}</td>
                <td>{r.trust_score}</td>
                <td>{r.priority}</td>
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
