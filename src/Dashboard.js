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

    setReports((prev) =>
      prev.map((r) =>
        r._id === id ? { ...r, status: newStatus } : r
      )
    );
  };

  const runAI = async (id) => {
    setRunningAI(id);

    try {
      const res = await fetch(`${BACKEND_URL}/reports/${id}/run-ai`, {
        method: "POST"
      });

      if (!res.ok) {
        throw new Error("AI failed");
      }

      await fetchReports();
    } catch {
      alert("AI verification failed. Try again later.");
    }

    setRunningAI(null);
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
              <th>Description</th>
              <th>Pincode</th>
              <th>Address</th>
              <th>AI Status</th>
              <th>Trust</th>
              <th>Priority</th>
              <th>Status</th>
              <th>AI Action</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r._id}>
                <td>{r.issue_type}</td>
                <td style={styles.desc}>{r.description || "—"}</td>
                <td>{r.pincode || "—"}</td>
                <td>{r.address || "—"}</td>
                <td>
                  <span style={aiStatusStyle(r.ai_status)}>
                    {r.ai_status}
                  </span>
                </td>
                <td>{r.trust_score ?? "—"}</td>
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
                <td>
                  {r.ai_status === "PENDING" ? (
                    <button
                      onClick={() => runAI(r._id)}
                      disabled={runningAI === r._id}
                    >
                      {runningAI === r._id
                        ? "Running..."
                        : "Run AI"}
                    </button>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

/* ------------------ STYLES ------------------ */

const styles = {
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px"
  },
  desc: {
    maxWidth: "240px",
    whiteSpace: "pre-wrap",
    fontSize: "14px"
  }
};

const priorityStyle = (priority) => {
  if (priority === "HIGH") return { color: "red", fontWeight: "bold" };
  if (priority === "MEDIUM") return { color: "orange", fontWeight: "bold" };
  if (priority === "LOW") return { color: "green", fontWeight: "bold" };
  return { color: "#555" };
};

const aiStatusStyle = (status) => {
  if (status === "COMPLETED") return { color: "green", fontWeight: "bold" };
  if (status === "FAILED") return { color: "red", fontWeight: "bold" };
  return { color: "orange", fontWeight: "bold" };
};

export default Dashboard;
