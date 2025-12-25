import React, { useEffect, useState } from "react";

const BACKEND_URL = "https://civic-eye-backend-tnsa.onrender.com";

function Dashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    const res = await fetch(`${BACKEND_URL}/reports`);
    const data = await res.json();
    setReports(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      await fetch(`${BACKEND_URL}/reports/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });

      // Update UI immediately (no reload)
      setReports((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, status: newStatus } : r
        )
      );
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (loading) {
    return <p style={{ padding: "20px" }}>Loading reports...</p>;
  }

  return (
    <div style={{ padding: "30px" }}>
      <h2>Authority Moderation Dashboard</h2>

      {reports.length === 0 ? (
        <p>No reports available.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Issue</th>
              <th>Trust Score</th>
              <th>Priority</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r._id}>
                <td>{r.issue_type}</td>
                <td>{r.trust_score}</td>
                <td>
                  <span style={priorityStyle(r.priority)}>
                    {r.priority}
                  </span>
                </td>
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
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const styles = {
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px"
  }
};

const priorityStyle = (priority) => {
  if (priority === "HIGH") {
    return { color: "red", fontWeight: "bold" };
  }
  if (priority === "MEDIUM") {
    return { color: "orange", fontWeight: "bold" };
  }
  return { color: "green", fontWeight: "bold" };
};

export default Dashboard;
