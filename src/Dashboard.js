import React, { useEffect, useState } from "react";

const BACKEND_URL = "https://civic-eye-backend-tnsa.onrender.com";

function Dashboard() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetch(`${BACKEND_URL}/reports`)
      .then(res => res.json())
      .then(data => setReports(data));
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <h2>Authority Moderation Dashboard</h2>

      {reports.length === 0 ? (
        <p>No reports available.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Issue</th>
              <th>Trust</th>
              <th>Priority</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(r => (
              <tr key={r._id}>
                <td>{r.issue_type}</td>
                <td>{r.trust_score}</td>
                <td>{r.priority}</td>
                <td>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Dashboard;
