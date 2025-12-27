import React, { useEffect, useState } from "react";

const BACKEND_URL = "https://civic-eye-backend-tnsa.onrender.com";

function Dashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [runningAI, setRunningAI] = useState(null);

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
    await fetch(`${BACKEND_URL}/reports/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus })
    });

    setReports(prev =>
      prev.map(r => (r._id === id ? { ...r, status: newStatus } : r))
    );
  };

  const runAI = async (id) => {
    setRunningAI(id);

    try {
      const res = await fetch(`${BACKEND_URL}/reports/${id}/run-ai`, {
        method: "POST"
      });

      if (!res.ok) throw new Error("AI failed");

      await fetchReports();
    } catch {
      alert("AI verification failed. You can retry.");
      await fetchReports();
    }

    setRunningAI(null);
  };

  if (loading) return <p style={{ padding: "20px" }}>Loading reports...</p>;

  return (
    <div style={{ padding: "30px" }}>
      <h2>Authority Moderation Dashboard</h2>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Issue</th>
            <th>Description</th>
            <th>AI Status</th>
            <th>Trust</th>
            <th>Priority</th>
            <th>Status</th>
            <th>AI Action</th>
          </tr>
        </thead>
        <tbody>
          {reports.map(r => (
            <tr key={r._id}>
              <td>{r.issue_type}</td>
              <td>{r.description || "—"}</td>
              <td style={{ fontWeight: "bold" }}>{r.ai_status}</td>
              <td>{r.trust_score ?? "—"}</td>
              <td>{r.priority}</td>
              <td>
                <select
                  value={r.status}
                  onChange={e => updateStatus(r._id, e.target.value)}
                >
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                </select>
              </td>
              <td>
                {(r.ai_status === "PENDING" || r.ai_status === "FAILED") && (
                  <button
                    onClick={() => runAI(r._id)}
                    disabled={runningAI === r._id}
                  >
                    {runningAI === r._id ? "Running…" : "Run AI"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
